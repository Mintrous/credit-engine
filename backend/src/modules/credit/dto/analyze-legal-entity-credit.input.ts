import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class AnalyzeLegalEntityCreditInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  @MinLength(8, { message: 'Company name must be at least 8 characters long' })
  companyName: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'CNPJ is required' })
  @Length(14, 14, { message: 'CNPJ must be 14 digits long' })
  @Matches(/^[0-9]+$/, { message: 'CNPJ must contain only numbers' })
  cnpj: string;

  @Field(() => Float)
  @IsNumber()
  @Min(500, { message: 'Monthly revenue must be at least 500' })
  monthlyRevenue: number;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;
}
