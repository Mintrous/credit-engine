import { gql } from '@apollo/client';
import type {
  CompanyInput,
  CreditAnalysis,
  LegalEntityAnalysis,
  PersonInput,
} from '../types/credit';
import { apolloClient } from './apolloClient';

export const ANALYZE_PERSON_MUTATION = gql`
  mutation AnalyzeCredit($input: AnalyzeCreditInput!) {
    analyzeCredit(input: $input) {
      id
      name
      age
      monthlyIncome
      city
      cpf
      score
      approved
      maxLoan
      temperature
      createdAt
    }
  }
`;

export const ANALYZE_COMPANY_MUTATION = gql`
  mutation AnalyzeLegalEntityCredit($input: AnalyzeLegalEntityCreditInput!) {
    analyzeLegalEntityCredit(input: $input) {
      id
      companyName
      cnpj
      monthlyRevenue
      city
      score
      approved
      maxLoan
      temperature
      createdAt
    }
  }
`;

const ANALYSES_BY_CPF_QUERY = gql`
  query AnalysesByCpf($cpf: String!) {
    analysesByCpf(cpf: $cpf) {
      id
      name
      age
      monthlyIncome
      city
      cpf
      score
      approved
      maxLoan
      temperature
      createdAt
    }
  }
`;

const ANALYSES_BY_CNPJ_QUERY = gql`
  query AnalysesByCnpj($cnpj: String!) {
    analysesByCnpj(cnpj: $cnpj) {
      id
      companyName
      cnpj
      monthlyRevenue
      city
      score
      approved
      maxLoan
      temperature
      createdAt
    }
  }
`;

export const creditApi = {
  analyzePerson: async (input: PersonInput): Promise<CreditAnalysis> => {
    const { data } = await apolloClient.mutate<{ analyzeCredit: CreditAnalysis }>({
      mutation: ANALYZE_PERSON_MUTATION,
      variables: { input },
    });

    if (!data) {
      throw new Error('No data returned from GraphQL');
    }

    return data.analyzeCredit;
  },

  analyzeCompany: async (input: CompanyInput): Promise<LegalEntityAnalysis> => {
    const { data } = await apolloClient.mutate<{
      analyzeLegalEntityCredit: LegalEntityAnalysis;
    }>({
      mutation: ANALYZE_COMPANY_MUTATION,
      variables: { input },
    });

    if (!data) {
      throw new Error('No data returned from GraphQL');
    }

    return data.analyzeLegalEntityCredit;
  },

  analysesByCpf: async (cpf: string): Promise<CreditAnalysis[]> => {
    const { data } = await apolloClient.query<{ analysesByCpf: CreditAnalysis[] }>({
      query: ANALYSES_BY_CPF_QUERY,
      variables: { cpf },
    });

    if (!data) {
      throw new Error('No data returned from GraphQL');
    }

    return data.analysesByCpf;
  },

  analysesByCnpj: async (cnpj: string): Promise<LegalEntityAnalysis[]> => {
    const { data } = await apolloClient.query<{
      analysesByCnpj: LegalEntityAnalysis[];
    }>({
      query: ANALYSES_BY_CNPJ_QUERY,
      variables: { cnpj },
    });

    if (!data) {
      throw new Error('No data returned from GraphQL');
    }

    return data.analysesByCnpj;
  },

  getHistory: async (): Promise<{
    naturalPersons: CreditAnalysis[];
    legalEntities: LegalEntityAnalysis[];
  }> => {
    const query = `
      query GetAllAnalyses {
        analysesByCpf(cpf: "*") {
          id
          name
          age
          monthlyIncome
          city
          cpf
          score
          approved
          maxLoan
          temperature
          createdAt
        }
      }
    `;

    return {
      naturalPersons: [],
      legalEntities: [],
    };
  },
};

