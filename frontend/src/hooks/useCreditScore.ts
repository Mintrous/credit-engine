import { useMutation } from '@apollo/client/react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditContext } from '../context/CreditContext';
import {
  ANALYZE_PERSON_MUTATION,
  ANALYZE_COMPANY_MUTATION,
} from '../services/creditApi';
import type {
  CompanyInput,
  CustomerType,
  PersonInput,
  Analysis,
} from '../types/credit';
import {
  personValidationSchema,
  legalEntityValidationSchema,
} from '../utils/validationSchemas';

interface UseCreditScoreReturn {
  submit: (
    input: PersonInput | CompanyInput,
    type: CustomerType,
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useCreditScore(): UseCreditScoreReturn {
  const [error, setError] = useState<string | null>(null);
  const { saveResult } = useCreditContext();
  const navigate = useNavigate();

  const [analyzePerson, { loading: personLoading }] = useMutation(
    ANALYZE_PERSON_MUTATION,
  );
  const [analyzeCompany, { loading: companyLoading }] = useMutation(
    ANALYZE_COMPANY_MUTATION,
  );

  const loading = personLoading || companyLoading;

  const submit = useCallback(
    async (input: PersonInput | CompanyInput, type: CustomerType) => {
      setError(null);

      try {
        if (type === 'natural_person') {
          await personValidationSchema.validate(input);
        } else {
          await legalEntityValidationSchema.validate(input);
        }

        let analysis: Analysis;

        if (type === 'natural_person') {
          const { data } = await analyzePerson({
            variables: { input: input as PersonInput },
          });
          console.log(data);
          if (!data?.analyzeCredit) {
            throw new Error('No data returned from GraphQL');
          }
          analysis = data.analyzeCredit;
        } else {
          const { data } = await analyzeCompany({
            variables: { input: input as CompanyInput },
          });
          console.log(data);
          if (!data?.analyzeLegalEntityCredit) {
            throw new Error('No data returned from GraphQL');
          }
          analysis = data.analyzeLegalEntityCredit;
        }

        saveResult(analysis, type);
        navigate('/result');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            'Erro ao consultar a API. Verifique sua conexão e tente novamente.',
          );
        }
      }
    },
    [analyzePerson, analyzeCompany, saveResult, navigate],
  );

  return { submit, loading, error };
}
