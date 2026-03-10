import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompanyForm } from './CompanyForm';
import { CreditContext } from '../../context/CreditContext';
import { ANALYZE_COMPANY_MUTATION } from '../../services/creditApi';
import type { LegalEntityAnalysis } from '../../types/credit';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSaveResult = vi.fn();
const ctx = { state: null, saveResult: mockSaveResult, clearResult: vi.fn() };

const mockAnalysisResult: LegalEntityAnalysis = {
  id: 'test-456',
  companyName: 'Borracharia Dois Irmãos',
  cnpj: '12345678000195',
  monthlyRevenue: 10000,
  city: 'Ibitinga',
  score: 300,
  approved: true,
  maxLoan: 20000,
  temperature: 25,
  createdAt: new Date().toISOString(),
};

const companyFormMocks = [
  {
    request: {
      query: ANALYZE_COMPANY_MUTATION,
      variables: {
        input: {
          companyName: 'Borracharia Dois Irmãos',
          cnpj: '12345678000195',
          monthlyRevenue: 10000,
          city: 'Ibitinga',
        },
      },
    },
    result: {
      data: {
        analyzeLegalEntityCredit: {
          __typename: 'LegalEntityAnalysis',
          ...mockAnalysisResult,
        },
      },
    },
  },
];

function renderForm() {
  return render(
    <MockedProvider mocks={companyFormMocks}>
      <CreditContext.Provider value={ctx}>
        <MemoryRouter>
          <CompanyForm />
        </MemoryRouter>
      </CreditContext.Provider>
    </MockedProvider>,
  );
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CompanyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText(/razão social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/faturamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
  });

  it('shows required errors when submitting empty form', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/razão social é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('validates minimum razão social length (< 8 chars)', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/razão social/i), 'Empresa');
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates minimum CNPJ length (< 14 chars)', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/cnpj/i), '1234567890');
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/mínimo 14 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates faturamento must be >= 500', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/faturamento/i), '100');
    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(screen.getByText(/maior ou igual a R\$ 500/i)).toBeInTheDocument();
    });
  });

  it('calls API and navigates to /result on valid submission', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText(/razão social/i), 'Borracharia Dois Irmãos');
    await userEvent.type(screen.getByLabelText(/cnpj/i), '12345678000195');
    await userEvent.type(screen.getByLabelText(/faturamento/i), '10000');
    await userEvent.type(screen.getByLabelText(/cidade/i), 'Ibitinga');

    fireEvent.click(screen.getByRole('button', { name: /analisar/i }));

    await waitFor(() => {
      expect(mockSaveResult).toHaveBeenCalledWith(
        expect.objectContaining(mockAnalysisResult),
        'legal_entity',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/result');
    });
  });
});
