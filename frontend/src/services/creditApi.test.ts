import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  PersonInput,
  CompanyInput,
  CreditAnalysis,
  LegalEntityAnalysis,
} from '../types/credit';
import { apolloClient } from './apolloClient';
import { creditApi } from './creditApi';

vi.mock('./apolloClient', () => ({
  apolloClient: {
    mutate: vi.fn(),
    query: vi.fn(),
  },
}));

const mockedApolloClient = vi.mocked(apolloClient);

describe('creditApi', () => {
  beforeEach(() => {
    mockedApolloClient.mutate.mockReset();
    mockedApolloClient.query.mockReset();
  });

  describe('analyzePerson', () => {
    it('should successfully analyze a person', async () => {
      const input: PersonInput = {
        name: 'João Silva',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };

      const mockResponse: CreditAnalysis = {
        id: 'abc-123',
        name: 'João Silva',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
        score: 250,
        approved: true,
        maxLoan: 15000,
        temperature: 25,
        createdAt: new Date().toISOString(),
      };

      mockedApolloClient.mutate.mockResolvedValueOnce({
        data: { analyzeCredit: mockResponse },
      });

      const result = await creditApi.analyzePerson(input);

      expect(result).toEqual(mockResponse);
      expect(mockedApolloClient.mutate).toHaveBeenCalledOnce();
    });

    it('should handle GraphQL errors', async () => {
      const input: PersonInput = {
        name: 'João Silva',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };

      mockedApolloClient.mutate.mockRejectedValueOnce(new Error('Invalid input'));

      await expect(creditApi.analyzePerson(input)).rejects.toThrow('Invalid input');
    });
  });

  describe('analyzeCompany', () => {
    it('should successfully analyze a company', async () => {
      const input: CompanyInput = {
        companyName: 'Empresa Ltda',
        cnpj: '12345678901234',
        monthlyRevenue: 50000,
        city: 'São Paulo',
      };

      const mockResponse: LegalEntityAnalysis = {
        id: 'xyz-789',
        companyName: 'Empresa Ltda',
        cnpj: '12345678901234',
        monthlyRevenue: 50000,
        city: 'São Paulo',
        score: 300,
        approved: true,
        maxLoan: 100000,
        temperature: 25,
        createdAt: new Date().toISOString(),
      };

      mockedApolloClient.mutate.mockResolvedValueOnce({
        data: { analyzeLegalEntityCredit: mockResponse },
      });

      const result = await creditApi.analyzeCompany(input);

      expect(result).toEqual(mockResponse);
      expect(mockedApolloClient.mutate).toHaveBeenCalledOnce();
    });
  });

  describe('analysesByCpf', () => {
    it('should fetch analyses by CPF', async () => {
      const mockResponse: CreditAnalysis[] = [
        {
          id: 'abc-123',
          name: 'João Silva',
          cpf: '12345678901',
          age: 30,
          monthlyIncome: 5000,
          city: 'São Paulo',
          score: 250,
          approved: true,
          maxLoan: 15000,
          temperature: 25,
          createdAt: new Date().toISOString(),
        },
      ];

      mockedApolloClient.query.mockResolvedValueOnce({
        data: { analysesByCpf: mockResponse },
      });

      const result = await creditApi.analysesByCpf('12345678901');

      expect(result).toEqual(mockResponse);
      expect(mockedApolloClient.query).toHaveBeenCalledOnce();
    });
  });

  describe('analysesByCnpj', () => {
    it('should fetch analyses by CNPJ', async () => {
      const mockResponse: LegalEntityAnalysis[] = [
        {
          id: 'xyz-789',
          companyName: 'Empresa Ltda',
          cnpj: '12345678901234',
          monthlyRevenue: 50000,
          city: 'São Paulo',
          score: 300,
          approved: true,
          maxLoan: 100000,
          temperature: 25,
          createdAt: new Date().toISOString(),
        },
      ];

      mockedApolloClient.query.mockResolvedValueOnce({
        data: { analysesByCnpj: mockResponse },
      });

      const result = await creditApi.analysesByCnpj('12345678901234');

      expect(result).toEqual(mockResponse);
      expect(mockedApolloClient.query).toHaveBeenCalledOnce();
    });
  });
});
