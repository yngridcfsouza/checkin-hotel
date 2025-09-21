import { useState, useCallback } from 'react';
import { 
  validateRequired, 
  validateEmail, 
  validateCPF, 
  validatePhone, 
  validateDate 
} from '@/utils/masks';
import { 
  getValidationMessage, 
  RequiredFieldKey, 
  InvalidFieldKey 
} from '@/utils/validation-messages';

// Tipos de validação disponíveis
export type ValidationType = 'required' | 'email' | 'cpf' | 'phone' | 'date';

// Interface para configuração de validação de um campo
export interface FieldValidationConfig {
  type: ValidationType;
  required?: boolean;
  fieldKey?: RequiredFieldKey | InvalidFieldKey;
}

// Interface para o estado de validação
export interface ValidationState {
  [fieldName: string]: {
    isValid: boolean;
    errorMessage: string;
  };
}

// Mapeamento de tipos de validação para suas funções
const VALIDATION_FUNCTIONS = {
  required: validateRequired,
  email: validateEmail,
  cpf: validateCPF,
  phone: validatePhone,
  date: validateDate
} as const;

export const useValidation = () => {
  const [validationState, setValidationState] = useState<ValidationState>({});

  // Função para validar um campo específico
  const validateField = useCallback((
    fieldName: string,
    value: string,
    config: FieldValidationConfig
  ): { isValid: boolean; errorMessage: string } => {
    const { type, required = false, fieldKey } = config;

    // Verificar se é obrigatório e está vazio
    if (required && (!value || value.trim() === '')) {
      const errorMessage = getValidationMessage.required(
        (fieldKey as RequiredFieldKey) || 'default'
      );
      return { isValid: false, errorMessage };
    }

    // Se não é obrigatório e está vazio, é válido
    if (!required && (!value || value.trim() === '')) {
      return { isValid: true, errorMessage: '' };
    }

    // Aplicar validação específica do tipo
    const validationFunction = VALIDATION_FUNCTIONS[type];
    const isValid = validationFunction(value);

    if (!isValid) {
      const errorMessage = getValidationMessage.invalid(
        (fieldKey as InvalidFieldKey) || 'default'
      );
      return { isValid: false, errorMessage };
    }

    return { isValid: true, errorMessage: '' };
  }, []);

  // Função para validar e atualizar o estado de um campo
  const validateAndUpdateField = useCallback((
    fieldName: string,
    value: string,
    config: FieldValidationConfig
  ): boolean => {
    const result = validateField(fieldName, value, config);
    
    setValidationState(prev => ({
      ...prev,
      [fieldName]: result
    }));

    return result.isValid;
  }, [validateField]);

  // Função para validar múltiplos campos
  const validateFields = useCallback((
    fields: Array<{
      name: string;
      value: string;
      config: FieldValidationConfig;
    }>
  ): boolean => {
    const newValidationState: ValidationState = {};
    let allValid = true;

    fields.forEach(({ name, value, config }) => {
      const result = validateField(name, value, config);
      newValidationState[name] = result;
      if (!result.isValid) {
        allValid = false;
      }
    });

    setValidationState(prev => ({
      ...prev,
      ...newValidationState
    }));

    return allValid;
  }, [validateField]);

  // Função para limpar erros de um campo específico
  const clearFieldError = useCallback((fieldName: string) => {
    setValidationState(prev => ({
      ...prev,
      [fieldName]: { isValid: true, errorMessage: '' }
    }));
  }, []);

  // Função para limpar todos os erros
  const clearAllErrors = useCallback(() => {
    setValidationState({});
  }, []);

  // Função para obter o estado de validação de um campo
  const getFieldValidation = useCallback((fieldName: string) => {
    return validationState[fieldName] || { isValid: true, errorMessage: '' };
  }, [validationState]);

  // Função para verificar se há erros
  const hasErrors = useCallback(() => {
    return Object.values(validationState).some(field => !field.isValid);
  }, [validationState]);

  return {
    validationState,
    validateField,
    validateAndUpdateField,
    validateFields,
    clearFieldError,
    clearAllErrors,
    getFieldValidation,
    hasErrors
  };
};