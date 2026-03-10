import { render, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreditProvider, useCreditContext } from './CreditContext';
import type { CreditAnalysis } from '../types/credit';

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

// ─── Test component ───────────────────────────────────────────────────────────

let capturedCtx: ReturnType<typeof useCreditContext>;

function Capture() {
  capturedCtx = useCreditContext();
  return null;
}

function renderProvider() {
  return render(
    <CreditProvider>
      <Capture />
    </CreditProvider>,
  );
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockAnalysis: CreditAnalysis = {
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

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CreditContext', () => {
  beforeEach(() => localStorageMock.clear());

  it('initializes with null state when localStorage is empty', () => {
    renderProvider();
    expect(capturedCtx.state).toBeNull();
  });

  it('saveResult updates state and persists to localStorage', () => {
    renderProvider();

    act(() => {
      capturedCtx.saveResult(mockAnalysis, 'natural_person');
    });

    expect(capturedCtx.state?.analysis.approved).toBe(true);
    expect(capturedCtx.state?.customerType).toBe('natural_person');
    expect(localStorageMock.getItem('credit_engine_result')).not.toBeNull();
  });

  it('clearResult sets state to null and removes from localStorage', () => {
    renderProvider();

    act(() => {
      capturedCtx.saveResult(mockAnalysis, 'natural_person');
    });

    act(() => {
      capturedCtx.clearResult();
    });

    expect(capturedCtx.state).toBeNull();
    expect(localStorageMock.getItem('credit_engine_result')).toBeNull();
  });

  it('hydrates from localStorage on mount', () => {
    localStorageMock.setItem(
      'credit_engine_result',
      JSON.stringify({ analysis: mockAnalysis, customerType: 'natural_person' }),
    );

    renderProvider();

    expect(capturedCtx.state?.analysis.name).toBe('João Silva');
    expect(capturedCtx.state?.analysis.maxLoan).toBe(15000);
  });

  it('saves to history localStorage', () => {
    renderProvider();

    act(() => {
      capturedCtx.saveResult(mockAnalysis, 'natural_person');
    });

    const historyData = localStorageMock.getItem('credit_engine_history');
    expect(historyData).not.toBeNull();

    if (historyData) {
      const history = JSON.parse(historyData);
      expect(history.naturalPersons).toHaveLength(1);
      expect(history.naturalPersons[0].name).toBe('João Silva');
    }
  });
});
