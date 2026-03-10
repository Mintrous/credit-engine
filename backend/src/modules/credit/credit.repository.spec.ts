import { CreditRepository } from './credit.repository';
import { CreditAnalysis } from './dto/credit-analysis.type';

// ─── Helper ──────────────────────────────────────────────────────────────────

const build = (overrides: Partial<CreditAnalysis> = {}): CreditAnalysis => ({
  id: 'id-1',
  name: 'Test',
  age: 30,
  monthlyIncome: 3000,
  city: 'São Paulo',
  cpf: '111.222.333-44',
  score: 250,
  approved: true,
  maxLoan: 9000,
  temperature: 25,
  createdAt: new Date().toISOString(),
  ...overrides,
});

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CreditRepository', () => {
  let repo: CreditRepository;

  beforeEach(() => {
    repo = new CreditRepository();
  });

  it('saves and returns the analysis', () => {
    const analysis = build();
    expect(repo.save(analysis, 'natural_person')).toEqual(analysis);
  });

  it('finds analyses by the correct CPF', () => {
    repo.save(build({ id: '1', cpf: '111.222.333-44' }), 'natural_person');
    repo.save(build({ id: '2', cpf: '999.888.777-66' }), 'natural_person');

    const results = repo.findByCpf('111.222.333-44');

    expect(results).toHaveLength(1);
    expect(results[0].cpf).toBe('111.222.333-44');
  });

  it('returns all analyses for the same CPF', () => {
    repo.save(build({ id: '1' }), 'natural_person');
    repo.save(build({ id: '2' }), 'natural_person');

    expect(repo.findByCpf('111.222.333-44')).toHaveLength(2);
  });

  it('returns an empty array for a CPF with no analyses', () => {
    expect(repo.findByCpf('000.000.000-00')).toEqual([]);
  });
});
