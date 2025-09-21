// Mensagens de validação centralizadas
export const VALIDATION_MESSAGES = {
  required: {
    name: 'Nome é obrigatório',
    email: 'E-mail é obrigatório',
    cpf: 'CPF é obrigatório',
    birthDate: 'Data de nascimento é obrigatória',
    phone: 'Telefone é obrigatório',
    nationality: 'Nacionalidade é obrigatória',
    address: 'Endereço é obrigatório',
    profession: 'Profissão é obrigatória',
    emergencyContact: 'Contato de emergência é obrigatório',
    emergencyPhone: 'Telefone de emergência é obrigatório',
    default: 'Este campo é obrigatório'
  },
  invalid: {
    email: 'E-mail inválido',
    cpf: 'CPF inválido',
    phone: 'Telefone inválido',
    birthDate: 'Data de nascimento inválida',
    date: 'Data inválida',
    default: 'Valor inválido'
  },
  success: {
    save: 'Dados salvos com sucesso!',
    update: 'Informações atualizadas com sucesso!'
  },
  error: {
    save: 'Erro ao salvar dados',
    network: 'Erro de conexão. Tente novamente.',
    generic: 'Ocorreu um erro inesperado'
  }
} as const;

// Tipos para garantir type safety
export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
export type RequiredFieldKey = keyof typeof VALIDATION_MESSAGES.required;
export type InvalidFieldKey = keyof typeof VALIDATION_MESSAGES.invalid;

// Função helper para obter mensagens de validação
export const getValidationMessage = {
  required: (field: RequiredFieldKey): string => 
    VALIDATION_MESSAGES.required[field] || VALIDATION_MESSAGES.required.default,
  
  invalid: (field: InvalidFieldKey): string => 
    VALIDATION_MESSAGES.invalid[field] || VALIDATION_MESSAGES.invalid.default,
  
  success: (type: keyof typeof VALIDATION_MESSAGES.success): string => 
    VALIDATION_MESSAGES.success[type],
  
  error: (type: keyof typeof VALIDATION_MESSAGES.error): string => 
    VALIDATION_MESSAGES.error[type]
};