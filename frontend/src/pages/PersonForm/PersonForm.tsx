import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormField } from '../../components/FormField/FormField';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { useCreditScore } from '../../hooks/useCreditScore';
import type { PersonInput } from '../../types/credit';
import { personValidationSchema } from '../../utils/validationSchemas';

export function PersonForm() {
  const navigate = useNavigate();
  const { submit, loading, error } = useCreditScore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonInput>({
    resolver: yupResolver(personValidationSchema),
  });

  const onSubmit = (data: PersonInput) => submit(data, 'natural_person');

  return (
    <PageLayout innerClassName="form-page">
      <header className="form-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Voltar
        </button>
        <div className="form-header__type">Pessoa Física</div>
        <h1 className="form-title">Dados para análise</h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form"
        data-testid="person-form"
        noValidate
      >
        <FormField
          label="Nome completo"
          placeholder="Mínimo 8 caracteres"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormField
          label="CPF"
          placeholder="Somente números (11 dígitos)"
          error={errors.cpf?.message}
          {...register('cpf')}
        />

        <FormField
          label="Idade"
          type="number"
          placeholder="Mínimo 18 anos"
          error={errors.age?.message}
          {...register('age', { valueAsNumber: true })}
        />

        <FormField
          label="Renda mensal (R$)"
          type="number"
          step="0.01"
          placeholder="Ex: 3000.00"
          error={errors.monthlyIncome?.message}
          {...register('monthlyIncome', { valueAsNumber: true })}
        />

        <FormField
          label="Cidade"
          placeholder="Ex: São Paulo"
          error={errors.city?.message}
          {...register('city')}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton loading={loading}>Analisar crédito</SubmitButton>
      </form>
    </PageLayout>
  );
}
