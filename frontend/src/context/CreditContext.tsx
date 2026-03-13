import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Analysis, CreditAnalysis, CustomerType, LegalEntityAnalysis, PersistedCreditState } from '../types/credit';
import { getJsonItem, removeItem as removeStorageItem, setJsonItem } from '../shared/storage/localStorage';

interface CreditContextValue {
  state: PersistedCreditState | null;
  saveResult: (analysis: Analysis, customerType: CustomerType) => void;
  clearResult: () => void;
}

interface StoredHistory {
  naturalPersons: CreditAnalysis[];
  legalEntities: LegalEntityAnalysis[];
}

const STORAGE_KEY = 'credit_engine_result';
const HISTORY_STORAGE_KEY = 'credit_engine_history';

function loadFromStorage(): PersistedCreditState | null {
  return getJsonItem<PersistedCreditState>(STORAGE_KEY) ?? null;
}

function saveToStorage(state: PersistedCreditState): void {
  setJsonItem(STORAGE_KEY, state);
}

function removeFromStorage(): void {
  removeStorageItem(STORAGE_KEY);
}

function loadHistoryFromStorage(): StoredHistory {
  return (
    getJsonItem<StoredHistory>(HISTORY_STORAGE_KEY, {
      fallback: { naturalPersons: [], legalEntities: [] },
    }) ?? { naturalPersons: [], legalEntities: [] }
  );
}

function saveHistoryToStorage(history: StoredHistory): void {
  setJsonItem(HISTORY_STORAGE_KEY, history);
}

function addToHistory(analysis: Analysis, customerType: CustomerType): void {
  const history = loadHistoryFromStorage();

  if (customerType === 'natural_person') {
    history.naturalPersons.unshift(analysis as CreditAnalysis);
    if (history.naturalPersons.length > 50) { // Aqui to mantendo apenas as últimas 50 análises
      history.naturalPersons = history.naturalPersons.slice(0, 50);
    }
  } else {
    history.legalEntities.unshift(analysis as LegalEntityAnalysis);
    if (history.legalEntities.length > 50) {
      history.legalEntities = history.legalEntities.slice(0, 50);
    }
  }

  saveHistoryToStorage(history);
}

export const CreditContext = createContext<CreditContextValue | null>(null);

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedCreditState | null>(loadFromStorage);

  const saveResult = useCallback(
    (analysis: Analysis, customerType: CustomerType) => {
      const customerName =
        customerType === 'natural_person'
          ? (analysis as CreditAnalysis).name
          : (analysis as LegalEntityAnalysis).companyName;
      const next: PersistedCreditState = { analysis, customerType, customerName };
      saveToStorage(next);
      addToHistory(analysis, customerType);
      setState(next);
    },
    [],
  );

  const clearResult = useCallback(() => {
    removeFromStorage();
    setState(null);
  }, []);

  const value = useMemo(
    () => ({ state, saveResult, clearResult }),
    [state, saveResult, clearResult],
  );

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}

// hook
export function useCreditContext(): CreditContextValue {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error('useCreditContext cannot be used outside of CreditProvider');
  return ctx;
}
