import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CreditModule } from './modules/credit/credit.module';
import type { GraphQLFormattedError } from 'graphql';

function formatGraphQLError(formatted: GraphQLFormattedError): GraphQLFormattedError {
  const ext = formatted.extensions as Record<string, unknown> | undefined;
  const original = ext?.originalError as { message?: string | string[] } | undefined;
  if (original?.message) {
    const msg = Array.isArray(original.message) ? original.message[0] : original.message;
    if (typeof msg === 'string') {
      return { ...formatted, message: msg };
    }
  }
  return formatted;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      formatError: formatGraphQLError,
    }),
    CreditModule,
  ],
})
export class AppModule {}
