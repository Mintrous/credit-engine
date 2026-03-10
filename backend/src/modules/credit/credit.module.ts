import { Module } from '@nestjs/common';
import { CreditResolver } from './credit.resolver';
import { CreditService } from './credit.service';
import { CreditRepository } from './credit.repository';
import { WeatherModule } from '../../shared/weather/weather.module';

@Module({
  imports: [WeatherModule],
  providers: [CreditResolver, CreditService, CreditRepository],
})
export class CreditModule {}
