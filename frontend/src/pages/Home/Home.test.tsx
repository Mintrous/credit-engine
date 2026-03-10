import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Home } from './Home';
import { CreditContext } from '../../context/CreditContext';
import type { PersistedCreditState } from '../../types/credit';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderHome(state: PersistedCreditState | null = null) {
  const ctx = {
    state,
    saveResult: vi.fn(),
    clearResult: vi.fn(),
  };
  return render(
    <CreditContext.Provider value={ctx}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </CreditContext.Provider>,
  );
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('Home', () => {
  it('renders both choice cards', () => {
    renderHome();
    expect(screen.getByTestId('btn-person')).toBeInTheDocument();
    expect(screen.getByTestId('btn-company')).toBeInTheDocument();
  });

  it('navigates to /person when Pessoa Física is clicked', () => {
    renderHome();
    fireEvent.click(screen.getByTestId('btn-person'));
    expect(mockNavigate).toHaveBeenCalledWith('/person');
  });

  it('navigates to /company when Pessoa Jurídica is clicked', () => {
    renderHome();
    fireEvent.click(screen.getByTestId('btn-company'));
    expect(mockNavigate).toHaveBeenCalledWith('/company');
  });

  it('navigates to /history when history button is clicked', () => {
    renderHome();
    fireEvent.click(screen.getByTestId('btn-history'));
    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });

  it('redirects to /result if a persisted state exists', () => {
    const state: PersistedCreditState = {
      result: { status: 'APPROVED', max_amount: 5000 },
      customerType: 'person',
      customerName: 'João',
    };
    renderHome(state);
    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });
});
