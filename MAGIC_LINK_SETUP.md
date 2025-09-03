# Configuração do Magic Link

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/checkin_hotel"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="CheckIn <no-reply@checkin.com>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Fluxo do Magic Link

1. **Registro de Email** (`/register/email`):
   - Usuário insere email
   - Sistema gera token único
   - Envia email com link mágico

2. **Verificação** (`/auth/magic`):
   - Usuário clica no link do email
   - Sistema verifica token e expiração
   - Redireciona para completar cadastro ou dashboard

3. **Completar Cadastro** (`/register/details`):
   - Usuário preenche dados restantes
   - Sistema cria conta no banco

## Dependências Instaladas

- `nodemailer` - Para envio de emails
- `@types/nodemailer` - Tipos TypeScript

## Migração do Banco

Execute a migração para criar a tabela `MagicLink`:

```bash
npx prisma migrate dev --name add-magic-link
```

## Testando o Fluxo

1. Acesse `/register/email`
2. Insira um email válido
3. Verifique o email recebido
4. Clique no link mágico
5. Complete o cadastro em `/register/details`
