import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Result of a credit analysis for legal entity' })
export class LegalEntityCreditAnalysis {
  @Field(() => String)
  id: string;

  @Field()
  companyName: string;

  @Field()
  cnpj: string;

  @Field(() => Float)
  monthlyRevenue: number;

  @Field()
  city: string;

  @Field(() => Int, { description: 'Calculated score (integer)' })
  score: number;

  @Field({ description: 'true if score >= 200' })
  approved: boolean;

  @Field(() => Float, { description: 'Max loan value (monthly revenue * 2) when approved' })
  maxLoan: number;

  @Field(() => Float, { description: 'Temperature in celsius obtained from OpenWeatherMap' })
  temperature: number;

  @Field()
  createdAt: string;
}
