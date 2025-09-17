# Script de Teste Manual - Rate Limiting e Bloqueio por IP
# Execute este script no PowerShell para testar o sistema de rate limiting

Write-Host "=== Teste Manual do Sistema de Rate Limiting ===" -ForegroundColor Green
Write-Host ""

# Configurações
$baseUrl = "http://localhost:3000"
$loginEndpoint = "$baseUrl/api/auth/login"
$testData = @{
    email = "test@example.com"
    password = "testpassword"
} | ConvertTo-Json

# Função para fazer request com cURL
function Invoke-TestRequest {
    param(
        [string]$Url,
        [string]$Data = $null,
        [string]$Method = "POST",
        [string]$Description = ""
    )
    
    Write-Host "$Description" -ForegroundColor Yellow
    
    if ($Data) {
        $response = curl -s -w "HTTP_CODE:%{http_code}|TIME:%{time_total}" -X $Method -H "Content-Type: application/json" -d $Data $Url
    } else {
        $response = curl -s -w "HTTP_CODE:%{http_code}|TIME:%{time_total}" -X $Method $Url
    }
    
    # Extrai código HTTP e tempo
    $httpCode = ($response | Select-String "HTTP_CODE:(\d+)").Matches[0].Groups[1].Value
    $time = ($response | Select-String "TIME:([\d.]+)").Matches[0].Groups[1].Value
    
    # Remove metadados da resposta
    $cleanResponse = $response -replace "HTTP_CODE:\d+\|TIME:[\d.]+", ""
    
    Write-Host "Status: $httpCode | Tempo: ${time}s" -ForegroundColor Cyan
    
    if ($cleanResponse) {
        try {
            $jsonResponse = $cleanResponse | ConvertFrom-Json
            Write-Host "Resposta: $($jsonResponse | ConvertTo-Json -Compress)" -ForegroundColor White
        } catch {
            Write-Host "Resposta: $cleanResponse" -ForegroundColor White
        }
    }
    
    Write-Host ""
    return @{ StatusCode = $httpCode; Time = $time; Response = $cleanResponse }
}

# Função para testar rate limiting
function Test-RateLimit {
    param(
        [string]$TestName,
        [string]$Endpoint,
        [int]$RequestCount = 5,
        [int]$DelayMs = 100
    )
    
    Write-Host "=== $TestName ===" -ForegroundColor Magenta
    Write-Host "Endpoint: $Endpoint"
    Write-Host "Requests: $RequestCount com delay de ${DelayMs}ms"
    Write-Host ""
    
    $results = @()
    
    for ($i = 1; $i -le $RequestCount; $i++) {
        $result = Invoke-TestRequest -Url $Endpoint -Data $testData -Description "Request $i/$RequestCount"
        $results += $result
        
        if ($DelayMs -gt 0 -and $i -lt $RequestCount) {
            Start-Sleep -Milliseconds $DelayMs
        }
    }
    
    # Análise dos resultados
    $successCount = ($results | Where-Object { $_.StatusCode -eq "200" }).Count
    $rateLimitCount = ($results | Where-Object { $_.StatusCode -eq "429" }).Count
    $blockedCount = ($results | Where-Object { $_.StatusCode -eq "403" }).Count
    
    Write-Host "=== Resumo do Teste ===" -ForegroundColor Green
    Write-Host "Sucessos (200): $successCount"
    Write-Host "Rate Limited (429): $rateLimitCount"
    Write-Host "Bloqueados (403): $blockedCount"
    Write-Host ""
    
    return $results
}

# Função para testar múltiplos IPs (simulado com headers)
function Test-MultipleIPs {
    Write-Host "=== Teste com Múltiplos IPs ===" -ForegroundColor Magenta
    
    $ips = @("192.168.1.100", "192.168.1.101", "192.168.1.102")
    
    foreach ($ip in $ips) {
        Write-Host "Testando IP: $ip" -ForegroundColor Yellow
        
        # Simula IP diferente usando header X-Forwarded-For
        for ($i = 1; $i -le 3; $i++) {
            $response = curl -s -w "HTTP_CODE:%{http_code}" -X POST -H "Content-Type: application/json" -H "X-Forwarded-For: $ip" -d $testData $loginEndpoint
            $httpCode = ($response | Select-String "HTTP_CODE:(\d+)").Matches[0].Groups[1].Value
            
            Write-Host "  Request $i - Status: $httpCode"
        }
        Write-Host ""
    }
}

# Função para teste de performance
function Test-Performance {
    Write-Host "=== Teste de Performance ===" -ForegroundColor Magenta
    
    $startTime = Get-Date
    $requestCount = 10
    
    Write-Host "Enviando $requestCount requests simultâneas..."
    
    $jobs = @()
    for ($i = 1; $i -le $requestCount; $i++) {
        $job = Start-Job -ScriptBlock {
            param($url, $data)
            $response = curl -s -w "HTTP_CODE:%{http_code}|TIME:%{time_total}" -X POST -H "Content-Type: application/json" -d $data $url
            return $response
        } -ArgumentList $loginEndpoint, $testData
        
        $jobs += $job
    }
    
    # Aguarda todos os jobs terminarem
    $results = $jobs | Wait-Job | Receive-Job
    $jobs | Remove-Job
    
    $endTime = Get-Date
    $totalTime = ($endTime - $startTime).TotalSeconds
    
    Write-Host "Tempo total: ${totalTime}s"
    Write-Host "Requests por segundo: $([math]::Round($requestCount / $totalTime, 2))"
    
    # Analisa resultados
    $statusCodes = @{}
    foreach ($result in $results) {
        $httpCode = ($result | Select-String "HTTP_CODE:(\d+)").Matches[0].Groups[1].Value
        if ($statusCodes.ContainsKey($httpCode)) {
            $statusCodes[$httpCode]++
        } else {
            $statusCodes[$httpCode] = 1
        }
    }
    
    Write-Host "Distribuição de status codes:"
    $statusCodes.GetEnumerator() | Sort-Object Key | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value) requests"
    }
    Write-Host ""
}

# Função principal
function Start-RateLimitTests {
    Write-Host "Verificando se o servidor está rodando..." -ForegroundColor Yellow
    
    try {
        $healthCheck = curl -s -w "HTTP_CODE:%{http_code}" "$baseUrl/api/health" 2>$null
        $httpCode = ($healthCheck | Select-String "HTTP_CODE:(\d+)").Matches[0].Groups[1].Value
        
        if ($httpCode -ne "200" -and $httpCode -ne "404") {
            Write-Host "Servidor não está respondendo. Certifique-se de que está rodando em $baseUrl" -ForegroundColor Red
            return
        }
    } catch {
        Write-Host "Erro ao conectar com o servidor. Certifique-se de que está rodando em $baseUrl" -ForegroundColor Red
        return
    }
    
    Write-Host "Servidor detectado. Iniciando testes..." -ForegroundColor Green
    Write-Host ""
    
    # Teste 1: Rate limiting básico
    Test-RateLimit -TestName "Rate Limiting Básico" -Endpoint $loginEndpoint -RequestCount 6 -DelayMs 200
    
    # Aguarda um pouco antes do próximo teste
    Write-Host "Aguardando 5 segundos antes do próximo teste..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    # Teste 2: Requests rápidas consecutivas
    Test-RateLimit -TestName "Requests Rápidas Consecutivas" -Endpoint $loginEndpoint -RequestCount 8 -DelayMs 50
    
    # Aguarda um pouco
    Write-Host "Aguardando 5 segundos antes do próximo teste..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    # Teste 3: Múltiplos IPs
    Test-MultipleIPs
    
    # Teste 4: Performance
    Test-Performance
    
    Write-Host "=== Testes Concluídos ===" -ForegroundColor Green
    Write-Host "Para testar manualmente, use os seguintes comandos:"
    Write-Host ""
    Write-Host "# Request normal:" -ForegroundColor Cyan
    Write-Host "curl -X POST -H 'Content-Type: application/json' -d '$testData' $loginEndpoint"
    Write-Host ""
    Write-Host "# Request com IP específico:" -ForegroundColor Cyan
    Write-Host "curl -X POST -H 'Content-Type: application/json' -H 'X-Forwarded-For: 192.168.1.123' -d '$testData' $loginEndpoint"
    Write-Host ""
    Write-Host "# Verificar headers de rate limit:" -ForegroundColor Cyan
    Write-Host "curl -I -X POST -H 'Content-Type: application/json' -d '$testData' $loginEndpoint"
}

# Executa os testes se o script for chamado diretamente
if ($MyInvocation.InvocationName -ne '.') {
    Start-RateLimitTests
}

# Exporta funções para uso manual
Export-ModuleMember -Function Start-RateLimitTests, Test-RateLimit, Test-MultipleIPs, Test-Performance, Invoke-TestRequest