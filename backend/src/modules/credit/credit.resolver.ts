import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreditService } from './credit.service';
import { AnalyzeCreditInput } from './dto/analyze-credit.input';
import { AnalyzeLegalEntityCreditInput } from './dto/analyze-legal-entity-credit.input';
import { CreditAnalysis } from './dto/credit-analysis.type';
import { LegalEntityCreditAnalysis } from './dto/legal-entity-credit-analysis.type';

@Resolver()
export class CreditResolver {
  constructor(private readonly creditService: CreditService) {}

  @Mutation(() => CreditAnalysis, {
    description: 'Analyzes a customer\'s (natural person) credit and returns the score and decision.',
  })
  analyzeCredit(@Args('input') input: AnalyzeCreditInput): Promise<CreditAnalysis> {
    return this.creditService.analyze(input);
  }

  @Mutation(() => LegalEntityCreditAnalysis, {
    description: 'Analyzes a legal entity\'s credit and returns the score and decision.',
  })
  analyzeLegalEntityCredit(@Args('input') input: AnalyzeLegalEntityCreditInput): Promise<LegalEntityCreditAnalysis> {
    return this.creditService.analyzeLegalEntity(input);
  }

  @Query(() => [CreditAnalysis], {
    description: 'Lists all credit analyses performed for a CPF (natural person tax ID).',
  })
  analysesByCpf(@Args('cpf') cpf: string): CreditAnalysis[] {
    return this.creditService.findByCpf(cpf);
  }

  @Query(() => [LegalEntityCreditAnalysis], {
    description: 'Lists all credit analyses performed for a CNPJ (legal entity tax ID).',
  })
  analysesByCnpj(@Args('cnpj') cnpj: string): LegalEntityCreditAnalysis[] {
    return this.creditService.findByCnpj(cnpj);
  }
}
