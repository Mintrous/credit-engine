import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
  Min,
  MinLength,
} from 'class-validator';


@InputType()
export class AnalyzeCreditInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Field(() => Int)
  @IsNumber()
  @Min(18, { message: 'Minimum age is 18' })
  age: number;

  @Field(() => Float)
  @IsNumber()
  @IsPositive({ message: 'Monthly income must be greater than 0' })
  monthlyIncome: number;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'CPF is required' })
  @Length(11, 11, { message: 'CPF must be 11 digits long' })
  @Matches(/^[0-9]+$/, { message: 'CPF must contain only numbers' })
  cpf: string;
}
