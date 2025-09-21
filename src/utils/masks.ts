// Utilitários para máscaras de entrada

export const maskCPF = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara XXX.XXX.XXX-XX
  return cleanValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCNPJ = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  return cleanValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskPhone = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleanValue.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    // Celular: (XX) XXXXX-XXXX
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

// Funções para remover máscaras (para validação)
export const removeCPFMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const removeCNPJMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const maskDate = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara DD/MM/AAAA
  return cleanValue
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})\d+?$/, '$1');
};

export const formatDateToBrazilian = (dateString: string): string => {
  if (!dateString) return '';
  
  // Se já está no formato brasileiro, retorna como está
  if (dateString.includes('/')) return dateString;
  
  // Se está no formato ISO (YYYY-MM-DD), converte para DD/MM/YYYY
  const date = new Date(dateString + 'T00:00:00'); // Adiciona horário para evitar problemas de timezone
  if (isNaN(date.getTime())) return dateString;
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatDateToISO = (brazilianDate: string): string => {
  if (!brazilianDate) return '';
  
  // Se já está no formato ISO, retorna como está
  if (brazilianDate.includes('-')) return brazilianDate;
  
  // Converte de DD/MM/YYYY para YYYY-MM-DD (formato brasileiro)
  const parts = brazilianDate.split('/');
  if (parts.length !== 3) return brazilianDate;
  
  const [day, month, year] = parts;
  
  // Validação básica dos valores
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
    return brazilianDate;
  }
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Funções de validação
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Aceita telefones com 10 dígitos (fixo) ou 11 dígitos (celular)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;
  
  // Verifica se o DDD é válido (11 a 99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  
  // Para celular (11 dígitos), o primeiro dígito após o DDD deve ser 9
  if (cleanPhone.length === 11) {
    const firstDigit = parseInt(cleanPhone.charAt(2));
    if (firstDigit !== 9) return false;
  }
  
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDate = (date: string): boolean => {
  if (!date) return false;
  
  let dateToValidate = date;
  
  // Se está no formato brasileiro (DD/MM/YYYY), converte para ISO
  if (date.includes('/')) {
    const parts = date.split('/');
    if (parts.length !== 3) return false;
    
    const [day, month, year] = parts;
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;
    
    dateToValidate = `${year}-${month}-${day}`;
  }
  
  // Verifica se é uma data válida
  const dateObj = new Date(dateToValidate);
  if (isNaN(dateObj.getTime())) return false;
  
  // Verifica se a data não é no futuro
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Final do dia atual
  
  if (dateObj > today) return false;
  
  // Verifica se a data não é muito antiga (mais de 120 anos)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  
  if (dateObj < minDate) return false;
  
  return true;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};