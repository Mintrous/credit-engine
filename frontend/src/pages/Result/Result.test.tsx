import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Result } from './Result';
import { CreditContext } from '../../context/CreditContext';
import type { PersistedCreditState, CreditAnalysis, LegalEntityAnalysis } from '../../types/credit';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockClearResult = vi.fn();

function renderResult(state: PersistedCreditState | null) {
  return render(
    <CreditContext.Provider value={{ state, saveResult: vi.fn(), clearResult: mockClearResult }}>
      <MemoryRouter>
        <Result />
      </MemoryRouter>
    </CreditContext.Provider>,
  );
}

const approvedPersonAnalysis: CreditAnalysis = {
  id: 'abc-123',
  name: 'João Silva',
  cpf: '12345678901',
  age: 30,
  monthlyIncome: 5000,
  city: 'São Paulo',
  score: 350,
  approved: true,
  maxLoan: 15000,
  temperature: 25,
  createdAt: new Date().toISOString(),
};

const deniedCompanyAnalysis: LegalEntityAnalysis = {
  id: 'xyz-789',
  companyName: 'Borracharia ABC',
  cnpj: '12345678901234',
  monthlyRevenue: 400,
  city: 'Ibitinga',
  score: 150,
  approved: false,
  maxLoan: 0,
  temperature: 25,
  createdAt: new Date().toISOString(),
};

const approvedState: PersistedCreditState = {
  analysis: approvedPersonAnalysis,
  customerType: 'natural_person',
};

const deniedState: PersistedCreditState = {
  analysis: deniedCompanyAnalysis,
  customerType: 'legal_entity',
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('Result', () => {
  it('redirects to / when there is no persisted state', () => {
    renderResult(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows CRÉDITO APROVADO badge for approved result', () => {
    renderResult(approvedState);
    expect(screen.getByText(/crédito aprovado/i)).toBeInTheDocument();
  });

  it('shows CRÉDITO NEGADO badge for denied result', () => {
    renderResult(deniedState);
    expect(screen.getByText(/crédito negado/i)).toBeInTheDocument();
  });

  it('displays the customer name for natural person', () => {
    renderResult(approvedState);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('displays the company name for legal entity', () => {
    renderResult(deniedState);
    expect(screen.getByText('Borracharia ABC')).toBeInTheDocument();
  });

  it('displays score', () => {
    renderResult(approvedState);
    expect(screen.getByTestId('score')).toHaveTextContent('350');
  });

  it('displays maxLoan when approved', () => {
    renderResult(approvedState);
    expect(screen.getByTestId('max-amount')).toHaveTextContent('R$');
    expect(screen.getByTestId('max-amount')).toHaveTextContent('15.000');
  });

  it('does not display maxLoan when denied', () => {
    renderResult(deniedState);
    expect(screen.queryByTestId('max-amount')).not.toBeInTheDocument();
  });

  it('clears result and navigates to / when restart button is clicked', () => {
    renderResult(approvedState);
    fireEvent.click(screen.getByTestId('btn-restart'));
    expect(mockClearResult).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to /history when history button is clicked', () => {
    renderResult(approvedState);
    fireEvent.click(screen.getByTestId('btn-history'));
    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });
});
