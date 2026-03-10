import { Injectable } from '@nestjs/common';
import { CreditAnalysis } from './dto/credit-analysis.type';
import { LegalEntityCreditAnalysis } from './dto/legal-entity-credit-analysis.type';

type AnalysisType = 'natural_person' | 'legal_entity';

interface StoredAnalysis {
  type: AnalysisType;
  data: CreditAnalysis | LegalEntityCreditAnalysis;
}

@Injectable()
export class CreditRepository {
  private readonly store: StoredAnalysis[] = []; // Armazenamento em memória

  save(analysis: CreditAnalysis, type: 'natural_person'): CreditAnalysis;
  save(analysis: LegalEntityCreditAnalysis, type: 'legal_entity'): LegalEntityCreditAnalysis;
  save(analysis: CreditAnalysis | LegalEntityCreditAnalysis, type: AnalysisType): CreditAnalysis | LegalEntityCreditAnalysis {
    this.store.push({ type, data: analysis });
    return analysis;
  }

  findByCpf(cpf: string): CreditAnalysis[] {
    return this.store
      .filter((item) => item.type === 'natural_person' && (item.data as CreditAnalysis).cpf === cpf)
      .map((item) => item.data as CreditAnalysis);
  }

  findByCnpj(cnpj: string): LegalEntityCreditAnalysis[] {
    return this.store
      .filter((item) => item.type === 'legal_entity' && (item.data as LegalEntityCreditAnalysis).cnpj === cnpj)
      .map((item) => item.data as LegalEntityCreditAnalysis);
  }

  findAll(): Array<CreditAnalysis | LegalEntityCreditAnalysis> {
    return this.store.map((item) => item.data);
  }
}
