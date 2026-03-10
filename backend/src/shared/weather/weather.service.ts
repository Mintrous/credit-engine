import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface OpenWeatherResponse {
  main: { temp: number };
}

const KELVIN_TO_CELSIUS = 273.15;

@Injectable()
export class WeatherService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getTemperature(city: string): Promise<number> {
    const apiKey = this.config.get<string>('OPENWEATHER_API_KEY');
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;

    try {
      const { data } = await firstValueFrom(
        this.http.get<OpenWeatherResponse>(url),
      );
      // The API returns temperature in Kelvin by default; convert to Celsius.
      return data.main.temp - KELVIN_TO_CELSIUS;
    } catch {
      throw new BadGatewayException(
        `Unable to fetch temperature for city "${city}". Check the city name and API key.`,
      );
    }
  }
}
