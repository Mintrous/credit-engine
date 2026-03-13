import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AnalyzeCreditInput } from './dto/analyze-credit.input';
import { AnalyzeLegalEntityCreditInput } from './dto/analyze-legal-entity-credit.input';
import { CreditAnalysis } from './dto/credit-analysis.type';
import { LegalEntityCreditAnalysis } from './dto/legal-entity-credit-analysis.type';
import { CreditRepository } from './credit.repository';
import { WeatherService } from '../../shared/weather/weather.service';

@Injectable()
export class CreditService {
  constructor(
    private readonly repository: CreditRepository,
    private readonly weatherService: WeatherService,
  ) {}

  async analyze(input: AnalyzeCreditInput): Promise<CreditAnalysis> {
    const temperature = await this.weatherService.getTemperature(input.city);

    const score = this.calculateScore(input.age, input.monthlyIncome, temperature);
    const approved = this.isApproved(score, input.age);
    const maxLoan = approved ? input.monthlyIncome * 3 : 0;

    const analysis: CreditAnalysis = {
      id: uuidv4(),
      ...input,
      score,
      approved,
      maxLoan,
      temperature,
      createdAt: new Date().toISOString(),
    };

    return this.repository.save(analysis, 'natural_person');
  }

  async analyzeLegalEntity(input: AnalyzeLegalEntityCreditInput): Promise<LegalEntityCreditAnalysis> {
    const temperature = await this.weatherService.getTemperature(input.city);

    const score = this.calculateLegalEntityScore(input.monthlyRevenue, temperature);
    const approved = this.isLegalEntityApproved(score);
    const maxLoan = approved ? input.monthlyRevenue * 2 : 0;

    const analysis: LegalEntityCreditAnalysis = {
      id: uuidv4(),
      ...input,
      score,
      approved,
      maxLoan,
      temperature,
      createdAt: new Date().toISOString(),
    };

    return this.repository.save(analysis, 'legal_entity');
  }

  findByCpf(cpf: string): CreditAnalysis[] {
    return this.repository.findByCpf(cpf);
  }

  findByCnpj(cnpj: string): LegalEntityCreditAnalysis[] {
    return this.repository.findByCnpj(cnpj);
  }

  calculateScore(age: number, monthlyIncome: number, temperature: number): number {
    const ageComponent         = age * 0.5;
    const incomeComponent      = (monthlyIncome / 100) * 2;
    const temperatureComponent = temperature * 5;
    return Math.floor(ageComponent + incomeComponent + temperatureComponent);
  }

  isApproved(score: number, age: number): boolean {
    return score >= 200 && age >= 18;
  }

  calculateLegalEntityScore(monthlyRevenue: number, temperature: number): number {
    const revenueComponent = (monthlyRevenue / 500) * 3;
    const temperatureComponent = temperature * 5;
    return Math.floor(revenueComponent + temperatureComponent);
  }

  isLegalEntityApproved(score: number): boolean {
    return score >= 200;
  }
}
