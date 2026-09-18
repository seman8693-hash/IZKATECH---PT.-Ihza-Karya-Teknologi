/**
 * Stub lingkungan browser (localStorage, sessionStorage, window) untuk menjalankan
 * modul aplikasi di Node saat test. File ini HARUS di-import paling awal sehingga
 * global tersedia sebelum modul store dievaluasi.
 */

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const globals = globalThis as unknown as Record<string, unknown>;

globals.localStorage = new MemoryStorage();
globals.sessionStorage = new MemoryStorage();

if (!globals.window) {
  globals.window = globals;
}

const win = globals.window as Record<string, unknown>;

if (typeof win.dispatchEvent !== 'function') {
  // Event tersedia di Node modern; store memakai window.dispatchEvent untuk sinkronisasi real-time
  win.dispatchEvent = () => true;
}
if (typeof win.addEventListener !== 'function') {
  win.addEventListener = () => undefined;
  win.removeEventListener = () => undefined;
}
if (!win.location) {
  win.location = { hash: '', pathname: '/', href: 'http://localhost/' };
}

export {};
