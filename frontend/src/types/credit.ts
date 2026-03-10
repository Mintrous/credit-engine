export type CustomerType = 'natural_person' | 'legal_entity';

export interface PersonInput {
  name: string;
  cpf: string;
  age: number;
  monthlyIncome: number;
  city: string;
}

export interface CreditAnalysis {
  id: string;
  name: string;
  age: number;
  monthlyIncome: number;
  city: string;
  cpf: string;
  score: number;
  approved: boolean;
  maxLoan: number;
  temperature: number;
  createdAt: string;
}

export interface CompanyInput {
  companyName: string;
  cnpj: string;
  monthlyRevenue: number;
  city: string;
}

export interface LegalEntityAnalysis {
  id: string;
  companyName: string;
  cnpj: string;
  monthlyRevenue: number;
  city: string;
  score: number;
  approved: boolean;
  maxLoan: number;
  temperature: number;
  createdAt: string;
}

export type Analysis = CreditAnalysis | LegalEntityAnalysis;

export interface PersistedCreditState {
  analysis: Analysis;
  customerType: CustomerType;
  customerName: string;
}
