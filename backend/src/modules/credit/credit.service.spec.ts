import { Test, TestingModule } from '@nestjs/testing';
import { CreditService } from './credit.service';
import { CreditRepository } from './credit.repository';
import { WeatherService } from '../../shared/weather/weather.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockWeather    = { getTemperature: jest.fn() };
const mockRepository = { save: jest.fn(), findByCpf: jest.fn(), findByCnpj: jest.fn(), findAll: jest.fn() };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const baseInput = {
  name: 'João Silva',
  age: 30,
  monthlyIncome: 1800,
  city: 'São Carlos',
  cpf: '123.456.789-00',
};

const baseLegalEntityInput = {
  companyName: 'Acme Corp',
  cnpj: '12.345.678/0001-90',
  monthlyRevenue: 50000,
  city: 'São Paulo',
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CreditService', () => {
  let service: CreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditService,
        { provide: CreditRepository, useValue: mockRepository },
        { provide: WeatherService,   useValue: mockWeather    },
      ],
    }).compile();

    service = module.get<CreditService>(CreditService);
    jest.clearAllMocks();
  });

  // ── calculateScore ──────────────────────────────────────────────────────────

  describe('calculateScore', () => {
    it('reproduces the statement example: age=30 income=1800 temp=30 → 201', () => {
      expect(service.calculateScore(30, 1800, 30)).toBe(201);
    });

    it('always returns an integer', () => {
      const score = service.calculateScore(25, 3333, 22.7);
      expect(Number.isInteger(score)).toBe(true);
    });

    it('correctly calculates each component in isolation', () => {
      // ageComponent         = 20 × 0.5  = 10
      // incomeComponent      = 5000/100×2 = 100
      // temperatureComponent = 18 × 5    = 90
      // total = 200
      expect(service.calculateScore(20, 5000, 18)).toBe(200);
    });
  });

  // ── isApproved ──────────────────────────────────────────────────────────────

  describe('isApproved', () => {
    it('approves when score >= 200 AND age >= 18', () => {
      expect(service.isApproved(201, 30)).toBe(true);
    });

    it('approves exactly on the boundary: score=200 and age=18', () => {
      expect(service.isApproved(200, 18)).toBe(true);
    });

    it('denies when score < 200', () => {
      expect(service.isApproved(199, 30)).toBe(false);
    });

    it('denies when age < 18 (minor)', () => {
      expect(service.isApproved(300, 17)).toBe(false);
    });

    it('denies when score < 200 and age < 18 simultaneously', () => {
      expect(service.isApproved(100, 15)).toBe(false);
    });
  });

  // ── analyze ─────────────────────────────────────────────────────────────────

  describe('analyze', () => {
    it('fetches temperature, calculates score, and persists the analysis', async () => {
      mockWeather.getTemperature.mockResolvedValue(30);
      mockRepository.save.mockImplementation((a) => a);

      const result = await service.analyze(baseInput);

      expect(mockWeather.getTemperature).toHaveBeenCalledWith('São Carlos');
      expect(result.score).toBe(201);
      expect(result.approved).toBe(true);
      expect(result.maxLoan).toBe(5400); // 1800 * 3
      expect(result.temperature).toBe(30);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ score: 201 }), 'natural_person');
    });

    it('denies credit for a minor even with a high score', async () => {
      mockWeather.getTemperature.mockResolvedValue(40);
      mockRepository.save.mockImplementation((a) => a);

      const result = await service.analyze({ ...baseInput, age: 16 });

      expect(result.approved).toBe(false);
      expect(result.maxLoan).toBe(0);
    });

    it('persists analysis with id and createdAt populated', async () => {
      mockWeather.getTemperature.mockResolvedValue(30);
      mockRepository.save.mockImplementation((a) => a);

      const result = await service.analyze(baseInput);

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });
  });

  // ── findByCpf ───────────────────────────────────────────────────────────────

  describe('findByCpf', () => {
    it('delegates to the repository and returns analyses for the CPF', () => {
      const mock = [{ cpf: '123.456.789-00', score: 201 }];
      mockRepository.findByCpf.mockReturnValue(mock);

      const result = service.findByCpf('123.456.789-00');

      expect(result).toEqual(mock);
      expect(mockRepository.findByCpf).toHaveBeenCalledWith('123.456.789-00');
    });

    it('returns empty array for unknown CPF', () => {
      mockRepository.findByCpf.mockReturnValue([]);

      expect(service.findByCpf('000.000.000-00')).toEqual([]);
    });
  });

  // ── calculateLegalEntityScore ────────────────────────────────────────────────

  describe('calculateLegalEntityScore', () => {
    it('correctly calculates score: revenue=50000 temp=25 → 425', () => {
      // revenueComponent = (50000 / 500) × 3 = 100 × 3 = 300
      // temperatureComponent = 25 × 5 = 125
      // total = 425
      expect(service.calculateLegalEntityScore(50000, 25)).toBe(425);
    });

    it('always returns an integer', () => {
      const score = service.calculateLegalEntityScore(45000, 22.7);
      expect(Number.isInteger(score)).toBe(true);
    });
  });

  // ── isLegalEntityApproved ────────────────────────────────────────────────────

  describe('isLegalEntityApproved', () => {
    it('approves when score >= 200', () => {
      expect(service.isLegalEntityApproved(200)).toBe(true);
      expect(service.isLegalEntityApproved(300)).toBe(true);
    });

    it('denies when score < 200', () => {
      expect(service.isLegalEntityApproved(199)).toBe(false);
    });
  });

  // ── analyzeLegalEntity ───────────────────────────────────────────────────────

  describe('analyzeLegalEntity', () => {
    it('fetches temperature, calculates score, and persists the analysis', async () => {
      mockWeather.getTemperature.mockResolvedValue(25);
      mockRepository.save.mockImplementation((a) => a);

      const result = await service.analyzeLegalEntity(baseLegalEntityInput);

      expect(mockWeather.getTemperature).toHaveBeenCalledWith('São Paulo');
      expect(result.score).toBe(425); // (50000/500)*3 + 25*5 = 300 + 125
      expect(result.approved).toBe(true);
      expect(result.maxLoan).toBe(100000); // 50000 * 2
      expect(result.temperature).toBe(25);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ score: 425 }), 'legal_entity');
    });

    it('denies credit when score < 200', async () => {
      mockWeather.getTemperature.mockResolvedValue(10);
      mockRepository.save.mockImplementation((a) => a);

      // score = (1000/500)*3 + 10*5 = 6 + 50 = 56
      const result = await service.analyzeLegalEntity({ ...baseLegalEntityInput, monthlyRevenue: 1000 });

      expect(result.approved).toBe(false);
      expect(result.maxLoan).toBe(0);
    });

    it('persists legal entity analysis with id and createdAt populated', async () => {
      mockWeather.getTemperature.mockResolvedValue(25);
      mockRepository.save.mockImplementation((a) => a);

      const result = await service.analyzeLegalEntity(baseLegalEntityInput);

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });
  });

  // ── findByCnpj ───────────────────────────────────────────────────────────────

  describe('findByCnpj', () => {
    it('delegates to the repository and returns analyses for the CNPJ', () => {
      const mock = [{ cnpj: '12.345.678/0001-90', score: 425 }];
      mockRepository.findByCnpj.mockReturnValue(mock);

      const result = service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mock);
      expect(mockRepository.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });

    it('returns empty array for unknown CNPJ', () => {
      mockRepository.findByCnpj.mockReturnValue([]);

      expect(service.findByCnpj('00.000.000/0000-00')).toEqual([]);
    });
  });
});
