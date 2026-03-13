export interface JsonStorageOptions<T> {
  fallback?: T;
}

function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getItem(key: string): string | null {
  if (!isBrowserEnvironment()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (!isBrowserEnvironment()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch { }
}

export function removeItem(key: string): void {
  if (!isBrowserEnvironment()) return;
  try {
    window.localStorage.removeItem(key);
  } catch { }
}

export function getJsonItem<T>(key: string, options?: JsonStorageOptions<T>): T | null | undefined {
  const raw = getItem(key);
  if (!raw) return options?.fallback ?? null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return options?.fallback ?? null;
  }
}

export function setJsonItem<T>(key: string, value: T): void {
  setItem(key, JSON.stringify(value));
}

