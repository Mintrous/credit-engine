import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormField } from '../../components/FormField/FormField';
import { useCreditScore } from '../../hooks/useCreditScore';
import type { CompanyInput } from '../../types/credit';
import { legalEntityValidationSchema } from '../../utils/validationSchemas';

export function CompanyForm() {
  const navigate = useNavigate();
  const { submit, loading, error } = useCreditScore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInput>({
    resolver: yupResolver(legalEntityValidationSchema),
  });

  const onSubmit = (data: CompanyInput) => submit(data, 'legal_entity');

  return (
    <div className="page">
      <div className="form-page">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Voltar</button>
          <div className="form-header__type">Pessoa Jurídica</div>
          <h1 className="form-title">Dados para análise</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="form" data-testid="company-form" noValidate>
          <FormField
            label="Razão social"
            placeholder="Mínimo 8 caracteres"
            error={errors.companyName?.message}
            {...register('companyName')}
          />

          <FormField
            label="CNPJ"
            placeholder="Somente números (14 dígitos)"
            error={errors.cnpj?.message}
            {...register('cnpj')}
          />

          <FormField
            label="Faturamento mensal (R$)"
            type="number"
            step="0.01"
            placeholder="Mínimo R$ 500,00"
            error={errors.monthlyRevenue?.message}
            {...register('monthlyRevenue', { valueAsNumber: true })}
          />

          <FormField
            label="Cidade"
            placeholder="Ex: Ibitinga"
            error={errors.city?.message}
            {...register('city')}
          />

          {error && <p className="api-error" role="alert">{error}</p>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? <span className="btn-spinner" /> : 'Analisar crédito'}
          </button>
        </form>
      </div>
    </div>
  );
}
