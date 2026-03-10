import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Result of a credit analysis for natural person' })
export class CreditAnalysis {
  @Field(() => String)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  age: number;

  @Field(() => Float)
  monthlyIncome: number;

  @Field()
  city: string;

  @Field()
  cpf: string;

  @Field(() => Int, { description: 'Calculated score (integer)' })
  score: number;

  @Field({ description: 'true if score >= 200 and age >= 18' })
  approved: boolean;

  @Field(() => Float, { description: 'Max loan value (monthly income * 3) when approved' })
  maxLoan: number;

  @Field(() => Float, { description: 'Temperature in celsius obtained from OpenWeatherMap' })
  temperature: number;

  @Field()
  createdAt: string;
}
