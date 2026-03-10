import * as yup from 'yup';

export const personValidationSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(8, 'Nome deve ter no mínimo 8 caracteres'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .min(11, 'CPF deve ter no mínimo 11 caracteres')
    .matches(/^[0-9]+$/, 'CPF deve conter apenas números'),
  age: yup
    .number()
    .required('Idade é obrigatória')
    .min(18, 'Idade mínima é 18 anos'),
  monthlyIncome: yup
    .number()
    .required('Renda mensal é obrigatória')
    .min(0.01, 'Renda deve ser maior que 0'),
  city: yup
    .string()
    .required('Cidade é obrigatória')
    .min(1, 'Cidade não pode estar vazia'),
});

export const legalEntityValidationSchema = yup.object({
  companyName: yup
    .string()
    .required('Razão social é obrigatória')
    .min(8, 'Razão social deve ter no mínimo 8 caracteres'),
  cnpj: yup
    .string()
    .required('CNPJ é obrigatório')
    .min(14, 'CNPJ deve ter no mínimo 14 caracteres')
    .matches(/^[0-9]+$/, 'CNPJ deve conter apenas números'),
  monthlyRevenue: yup
    .number()
    .required('Faturamento mensal é obrigatório')
    .min(500, 'Faturamento deve ser maior ou igual a R$ 500'),
  city: yup
    .string()
    .required('Cidade é obrigatória')
    .min(1, 'Cidade não pode estar vazia'),
});

export type PersonFormData = yup.InferType<typeof personValidationSchema>;
export type LegalEntityFormData = yup.InferType<typeof legalEntityValidationSchema>;
