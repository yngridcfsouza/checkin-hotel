'use client';

import DashboardHeader from '@/components/layout/DashboardHeader';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit2, Save, X, User, Mail, Phone, Calendar, CreditCard, MapPin } from 'lucide-react';
import { maskCPF, maskPhone, formatDateToBrazilian, formatDateToISO } from '@/utils/masks';
import { useValidation, FieldValidationConfig } from '@/hooks/useValidation';
import { getValidationMessage } from '@/utils/validation-messages';

interface EditableFieldProps {
  label: string;
  value: string;
  field: string;
  type?: 'text' | 'email' | 'date';
  mask?: (value: string) => string;
  validator?: (value: string) => boolean;
  required?: boolean;
  icon?: React.ReactNode;
  // Props para estado centralizado
  isEditing: boolean;
  editValue: string;
  errorMessage: string;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onValueChange: (value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  field,
  type = 'text',
  mask,
  required = false,
  icon,
  isEditing,
  editValue,
  errorMessage,
  onStartEdit,
  onCancel,
  onSave,
  onValueChange
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  const displayValue = () => {
    if (type === 'date') {
      return formatDateToBrazilian(value);
    }

    // Aplica máscara na exibição se fornecida
    if (mask && value) {
      return mask(value);
    }

    return value;
  };

  const isValid = !errorMessage;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <Label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartEdit}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={!isValid}
              className={`${
                isValid
                  ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <Input
            type={type}
            value={type === 'date' ? editValue : (mask && editValue ? mask(editValue) : editValue)}
            onChange={handleInputChange}
            className={`w-full ${!isValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            autoFocus
          />
          {!isValid && errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      ) : (
        <div className="text-gray-900 font-medium">
          {displayValue() || <span className="text-gray-400 italic">Não informado</span>}
        </div>
      )}
    </div>
  );
}

export default function FNRHPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para os dados editáveis
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    nationality: 'Brasileira',
    profession: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Estados centralizados para edição
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Hook de validação
  const {
    validateAndUpdateField,
    getFieldValidation,
    clearFieldError,
    hasErrors
  } = useValidation();

  // Configurações de validação para cada campo
  const fieldValidationConfigs: Record<string, FieldValidationConfig> = {
    name: { type: 'required', required: true, fieldKey: 'name' },
    email: { type: 'email', required: true, fieldKey: 'email' },
    cpf: { type: 'cpf', required: true, fieldKey: 'cpf' },
    birthDate: { type: 'date', required: true, fieldKey: 'birthDate' },
    phone: { type: 'phone', required: true, fieldKey: 'phone' },
    nationality: { type: 'required', required: true, fieldKey: 'nationality' },
    address: { type: 'required', required: true, fieldKey: 'address' },
    profession: { type: 'required', required: true, fieldKey: 'profession' },
    emergencyContact: { type: 'required', required: true, fieldKey: 'emergencyContact' },
    emergencyPhone: { type: 'phone', required: true, fieldKey: 'emergencyPhone' }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Inicializa os valores dos campos quando userData muda
  useEffect(() => {
    setFieldValues(userData);
  }, [userData]);

  // Função para validar um campo usando o hook
  const validateField = (field: string, value: string): boolean => {
    const config = fieldValidationConfigs[field];
    if (!config) return true;

    return validateAndUpdateField(field, value, config);
  };

  // Função para iniciar edição de um campo
  const startEditing = (field: string) => {
    setEditingFields(prev => ({ ...prev, [field]: true }));
    setFieldValues(prev => ({ ...prev, [field]: userData[field as keyof typeof userData] }));
    clearFieldError(field);
  };

  // Função para cancelar edição de um campo
  const cancelEditing = (field: string) => {
    setEditingFields(prev => ({ ...prev, [field]: false }));
    clearFieldError(field);
    setFieldValues(prev => ({ ...prev, [field]: userData[field as keyof typeof userData] }));
  };

  // Função para atualizar valor de um campo
  const updateFieldValue = (field: string, value: string, mask?: (value: string) => string, type?: string) => {
    let newValue = value;

    // Para campos de data, não aplica máscara pois o input type="date" já formata
    if (type !== 'date' && mask) {
      newValue = mask(newValue);
    }

    setFieldValues(prev => ({ ...prev, [field]: newValue }));
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');

      if (!res.ok) {
        router.push('/register');
        return;
      }

      const data = await res.json();
      setUser(data.user);

      // Pré-popular os dados do usuário
      setUserData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.guest?.phone || '',
        cpf: data.user.guest?.cpf || '',
        birthDate: data.user.guest?.birthDate ? 
          (() => {
            try {
              const dateStr = data.user.guest.birthDate;
              // Se já é uma data válida do Prisma (DateTime), usar diretamente
              if (dateStr instanceof Date || typeof dateStr === 'string') {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                  return date.toISOString().split('T')[0];
                }
              }
              return '';
            } catch (error) {
              console.error('Erro ao processar data de nascimento:', error);
              return '';
            }
          })() : '',
        address: data.user.hotel?.address || '',
        nationality: 'Brasileira',
        profession: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/register');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSave = async (field: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      // Atualiza o estado local
      setUserData(prev => ({ ...prev, [field]: value }));
      setEditingFields(prev => ({ ...prev, [field]: false }));

      toast.success(getValidationMessage.success('update'));
    } catch (error) {
      toast.error(getValidationMessage.error('save'));
    } finally {
      setSaving(false);
    }
  };

  // Função para salvar um campo específico
  const saveField = async (field: string, type?: string) => {
    const value = fieldValues[field] || '';
    let valueToSave = value;

    // Se for data, converte para formato ISO antes de salvar
    if (type === 'date') {
      valueToSave = formatDateToISO(value);
    }

    // Valida antes de salvar
    if (!validateField(field, valueToSave)) {
      return;
    }

    await handleSave(field, valueToSave);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardHeader user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-50 pt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ficha Nacional de Registro de Hóspedes (FNRH)
              </h1>
              <p className="text-gray-600">
                Gerencie suas informações pessoais. Clique no ícone de edição para alterar os dados.
              </p>
            </div>

            {/* Informações Pessoais */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Nome Completo"
                  value={userData.name}
                  field="name"
                  required={true}
                  icon={<User className="h-4 w-4" />}
                  isEditing={editingFields.name || false}
                  editValue={fieldValues.name || ''}
                  errorMessage={getFieldValidation('name').errorMessage}
                  onStartEdit={() => startEditing('name')}
                  onCancel={() => cancelEditing('name')}
                  onSave={() => saveField('name')}
                  onValueChange={(value) => {
                    updateFieldValue('name', value);
                    if (value) validateField('name', value);
                  }}
                />

                <EditableField
                  label="E-mail"
                  value={userData.email}
                  field="email"
                  type="email"
                  required={true}
                  icon={<Mail className="h-4 w-4" />}
                  isEditing={editingFields.email || false}
                  editValue={fieldValues.email || ''}
                  errorMessage={getFieldValidation('email').errorMessage}
                  onStartEdit={() => startEditing('email')}
                  onCancel={() => cancelEditing('email')}
                  onSave={() => saveField('email', 'email')}
                  onValueChange={(value) => {
                    updateFieldValue('email', value);
                    if (value) validateField('email', value);
                  }}
                />

                <EditableField
                  label="CPF"
                  value={userData.cpf}
                  field="cpf"
                  required={true}
                  mask={maskCPF}
                  icon={<CreditCard className="h-4 w-4" />}
                  isEditing={editingFields.cpf || false}
                  editValue={fieldValues.cpf || ''}
                  errorMessage={getFieldValidation('cpf').errorMessage}
                  onStartEdit={() => startEditing('cpf')}
                  onCancel={() => cancelEditing('cpf')}
                  onSave={() => saveField('cpf')}
                  onValueChange={(value) => {
                    updateFieldValue('cpf', value, maskCPF);
                    if (value) validateField('cpf', value);
                  }}
                />

                <EditableField
                  label="Data de Nascimento"
                  value={userData.birthDate}
                  field="birthDate"
                  type="date"
                  required={true}
                  icon={<Calendar className="h-4 w-4" />}
                  isEditing={editingFields.birthDate || false}
                  editValue={fieldValues.birthDate || ''}
                  errorMessage={getFieldValidation('birthDate').errorMessage}
                  onStartEdit={() => startEditing('birthDate')}
                  onCancel={() => cancelEditing('birthDate')}
                  onSave={() => saveField('birthDate', 'date')}
                  onValueChange={(value) => {
                    updateFieldValue('birthDate', value, undefined, 'date');
                    if (value) validateField('birthDate', value);
                  }}
                />

                <EditableField
                  label="Telefone"
                  value={userData.phone}
                  field="phone"
                  required={true}
                  mask={maskPhone}
                  icon={<Phone className="h-4 w-4" />}
                  isEditing={editingFields.phone || false}
                  editValue={fieldValues.phone || ''}
                  errorMessage={getFieldValidation('phone')?.errorMessage || ''}
                  onStartEdit={() => startEditing('phone')}
                  onCancel={() => cancelEditing('phone')}
                  onSave={() => saveField('phone')}
                  onValueChange={(value) => {
                    updateFieldValue('phone', value, maskPhone);
                    if (value) validateField('phone', value);
                  }}
                />

                <EditableField
                  label="Nacionalidade"
                  value={userData.nationality}
                  field="nationality"
                  required={true}
                  icon={<MapPin className="h-4 w-4" />}
                  isEditing={editingFields.nationality || false}
                  editValue={fieldValues.nationality || ''}
                  errorMessage={getFieldValidation('nationality')?.errorMessage || ''}
                  onStartEdit={() => startEditing('nationality')}
                  onCancel={() => cancelEditing('nationality')}
                  onSave={() => saveField('nationality')}
                  onValueChange={(value) => {
                    updateFieldValue('nationality', value);
                    if (value) validateField('nationality', value);
                  }}
                />
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Informações Adicionais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Endereço Residencial"
                  value={userData.address}
                  field="address"
                  required={true}
                  icon={<MapPin className="h-4 w-4" />}
                  isEditing={editingFields.address || false}
                  editValue={fieldValues.address || ''}
                  errorMessage={getFieldValidation('address')?.errorMessage || ''}
                  onStartEdit={() => startEditing('address')}
                  onCancel={() => cancelEditing('address')}
                  onSave={() => saveField('address')}
                  onValueChange={(value) => {
                    updateFieldValue('address', value);
                    if (value) validateField('address', value);
                  }}
                />

                <EditableField
                  label="Profissão"
                  value={userData.profession}
                  field="profession"
                  required={true}
                  icon={<User className="h-4 w-4" />}
                  isEditing={editingFields.profession || false}
                  editValue={fieldValues.profession || ''}
                  errorMessage={getFieldValidation('profession')?.errorMessage || ''}
                  onStartEdit={() => startEditing('profession')}
                  onCancel={() => cancelEditing('profession')}
                  onSave={() => saveField('profession')}
                  onValueChange={(value) => {
                    updateFieldValue('profession', value);
                    if (value) validateField('profession', value);
                  }}
                />

                <EditableField
                  label="Contato de Emergência"
                  value={userData.emergencyContact}
                  field="emergencyContact"
                  required={true}
                  icon={<User className="h-4 w-4" />}
                  isEditing={editingFields.emergencyContact || false}
                  editValue={fieldValues.emergencyContact || ''}
                  errorMessage={getFieldValidation('emergencyContact')?.errorMessage || ''}
                  onStartEdit={() => startEditing('emergencyContact')}
                  onCancel={() => cancelEditing('emergencyContact')}
                  onSave={() => saveField('emergencyContact')}
                  onValueChange={(value) => {
                    updateFieldValue('emergencyContact', value);
                    if (value) validateField('emergencyContact', value);
                  }}
                />

                <EditableField
                  label="Telefone de Emergência"
                  value={userData.emergencyPhone}
                  field="emergencyPhone"
                  required={true}
                  mask={maskPhone}
                  icon={<Phone className="h-4 w-4" />}
                  isEditing={editingFields.emergencyPhone || false}
                  editValue={fieldValues.emergencyPhone || ''}
                  errorMessage={getFieldValidation('emergencyPhone')?.errorMessage || ''}
                  onStartEdit={() => startEditing('emergencyPhone')}
                  onCancel={() => cancelEditing('emergencyPhone')}
                  onSave={() => saveField('emergencyPhone')}
                  onValueChange={(value) => {
                    updateFieldValue('emergencyPhone', value, maskPhone);
                    if (value) validateField('emergencyPhone', value);
                  }}
                />
              </div>
            </div>

            {/* Informações Legais */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Informações Importantes
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A FNRH é obrigatória conforme Lei nº 11.771/2008</li>
                <li>• Todos os dados são protegidos pela LGPD</li>
                <li>• As informações são utilizadas apenas para fins de hospedagem</li>
                <li>• Mantenha seus dados sempre atualizados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
