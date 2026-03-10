import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersonForm } from './PersonForm';
import { CreditContext } from '../../context/CreditContext';
import { ANALYZE_PERSON_MUTATION } from '../../services/creditApi';
import type { CreditAnalysis } from '../../types/credit';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSaveResult = vi.fn();
const ctx = { state: null, saveResult: mockSaveResult, clearResult: vi.fn() };

const mockAnalysisResult: CreditAnalysis = {
  id: 'test-123',
  name: 'João Silva Souza',
  cpf: '12345678901',
  age: 30,
  monthlyIncome: 2000,
  city: 'São Paulo',
  score: 275,
  approved: true,
  maxLoan: 6000,
  temperature: 25,
  createdAt: new Date().toISOString(),
};

const personFormMocks = [
  {
    request: {
      query: ANALYZE_PERSON_MUTATION,
      variables: {
        input: {
          name: 'João Silva Souza',
          cpf: '12345678901',
          age: 30,
          monthlyIncome: 2000,
          city: 'São Paulo',
        },
      },
    },
    result: {
      data: {
        analyzeCredit: {
          __typename: 'CreditAnalysis',
          ...mockAnalysisResult,
        },
      },
    },
  },
];

function renderForm() {
  return render(
    <MockedProvider mocks={personFormMocks}>
      <CreditContext.Provider value={ctx}>
        <MemoryRouter>
          <PersonForm />
        </MemoryRouter>
      </CreditContext.Provider>
    </MockedProvider>,
  );
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('PersonForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('CPF')).toBeInTheDocument();
    expect(screen.getByLabelText('Idade')).toBeInTheDocument();
    expect(screen.getByLabelText('Renda mensal (R$)')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
  });

  it('shows required errors when submitting empty form', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('validates minimum name length (< 8 chars)', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/nome completo/i), 'João');
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Nome deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates minimum CPF length (< 11 chars)', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/cpf/i), '1234');
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/CPF deve ter no mínimo 11 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates minimum age of 18', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText('Idade'), '16');
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Idade mínima é 18 anos/i)).toBeInTheDocument();
    });
  });

  it('calls API and navigates to /result on valid submission', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('Nome completo'), 'João Silva Souza');
    await userEvent.type(screen.getByLabelText('CPF'), '12345678901');
    await userEvent.type(screen.getByLabelText('Idade'), '30');
    await userEvent.type(screen.getByLabelText('Renda mensal (R$)'), '2000');
    await userEvent.type(screen.getByLabelText('Cidade'), 'São Paulo');

    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(mockSaveResult).toHaveBeenCalledWith(
        expect.objectContaining(mockAnalysisResult),
        'natural_person',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/result');
    });
  });
});
