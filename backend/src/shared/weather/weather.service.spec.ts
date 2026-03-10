import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadGatewayException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { WeatherService } from './weather.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockHttp   = { get: jest.fn() };
const mockConfig = { get: jest.fn().mockReturnValue('fake-api-key') };

const toAxiosResponse = (tempKelvin: number): AxiosResponse => ({
  data: { main: { temp: tempKelvin } },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
});

const KELVIN_TO_CELSIUS = 273.15;

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: HttpService,   useValue: mockHttp   },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    jest.clearAllMocks();
  });

  it('returns the temperature converted from Kelvin to Celsius', async () => {
    mockHttp.get.mockReturnValue(of(toAxiosResponse(294.3)));

    const temp = await service.getTemperature('São Carlos');

    expect(temp).toBeCloseTo(294.3 - KELVIN_TO_CELSIUS, 5);
  });

  it('calls the API with the correct city and API key', async () => {
    mockHttp.get.mockReturnValue(of(toAxiosResponse(300)));

    await service.getTemperature('Campinas');

    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('q=Campinas'),
    );
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('appid=fake-api-key'),
    );
  });

  it('throws BadGatewayException when the external API fails', async () => {
    mockHttp.get.mockReturnValue(throwError(() => new Error('Network error')));

    await expect(service.getTemperature('CidadeInvalida')).rejects.toThrow(
      BadGatewayException,
    );
  });
});
