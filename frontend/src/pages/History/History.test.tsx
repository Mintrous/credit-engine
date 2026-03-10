import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { History } from './History';
import type { CreditAnalysis, LegalEntityAnalysis } from '../../types/credit';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

// ─── localStorage mock ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ─── Test data ────────────────────────────────────────────────────────────────

const mockPersonAnalyses: CreditAnalysis[] = [
  {
    id: 'ab-1',
    name: 'João Silva',
    cpf: '11111111111',
    age: 30,
    monthlyIncome: 5000,
    city: 'São Paulo',
    score: 350,
    approved: true,
    maxLoan: 15000,
    temperature: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ab-2',
    name: 'Maria Santos',
    cpf: '22222222222',
    age: 28,
    monthlyIncome: 3000,
    city: 'Rio de Janeiro',
    score: 200,
    approved: false,
    maxLoan: 0,
    temperature: 30,
    createdAt: new Date().toISOString(),
  },
];

const mockCompanyAnalyses: LegalEntityAnalysis[] = [
  {
    id: 'xy-1',
    companyName: 'Borracharia Dois Irmãos',
    cnpj: '12345678000195',
    monthlyRevenue: 50000,
    city: 'Ibitinga',
    score: 400,
    approved: true,
    maxLoan: 100000,
    temperature: 25,
    createdAt: new Date().toISOString(),
  },
];

function renderHistory() {
  return render(
    <MemoryRouter>
      <History />
    </MemoryRouter>,
  );
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('History', () => {
  beforeEach(() => localStorageMock.clear());

  it('renders both sections', async () => {
    renderHistory();

    await waitFor(() => {
      expect(screen.getByTestId('persons-section')).toBeInTheDocument();
      expect(screen.getByTestId('companies-section')).toBeInTheDocument();
    });
  });

  it('renders person entries from localStorage', async () => {
    localStorageMock.setItem(
      'credit_engine_history',
      JSON.stringify({ naturalPersons: mockPersonAnalyses, legalEntities: [] }),
    );

    renderHistory();

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });
  });

  it('renders company entries from localStorage', async () => {
    localStorageMock.setItem(
      'credit_engine_history',
      JSON.stringify({ naturalPersons: [], legalEntities: mockCompanyAnalyses }),
    );

    renderHistory();

    await waitFor(() => {
      expect(screen.getByText('Borracharia Dois Irmãos')).toBeInTheDocument();
    });
  });

  it('shows Aprovado badge for approved entries', async () => {
    localStorageMock.setItem(
      'credit_engine_history',
      JSON.stringify({ naturalPersons: mockPersonAnalyses, legalEntities: [] }),
    );

    renderHistory();

    await waitFor(() => {
      const badges = screen.getAllByText('Aprovado');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('shows Negado badge for denied entries', async () => {
    localStorageMock.setItem(
      'credit_engine_history',
      JSON.stringify({ naturalPersons: mockPersonAnalyses, legalEntities: [] }),
    );

    renderHistory();

    await waitFor(() => {
      expect(screen.getByText('Negado')).toBeInTheDocument();
    });
  });

  it('displays scores in history list', async () => {
    localStorageMock.setItem(
      'credit_engine_history',
      JSON.stringify({ naturalPersons: mockPersonAnalyses, legalEntities: [] }),
    );

    renderHistory();

    await waitFor(() => {
      expect(screen.getByText('Pontuação: 350')).toBeInTheDocument();
      expect(screen.getByText('Pontuação: 200')).toBeInTheDocument();
    });
  });

  it('shows empty message when no entries', async () => {
    renderHistory();

    await waitFor(() => {
      const emptyMessages = screen.getAllByText('Nenhum registro encontrado.');
      expect(emptyMessages.length).toBe(2); // One for each section
    });
  });
});
