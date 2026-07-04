interface KeyState {
  key: string;
  requestsToday: number;
  dailyCap: number;
  cooldownUntil: number;
  lastError: string | null;
}

const DAILY_CAP = 1500;
const RATE_LIMIT_COOLDOWN_MS = 60_000;
const RESET_INTERVAL_MS = 86_400_000;

export class KeyManager {
  private keys: KeyState[] = [];
  private currentIndex = 0;
  private lastReset = Date.now();

  constructor() {
    const raw = import.meta.env.VITE_GEMINI_KEYS as string | undefined;
    if (!raw) {
      console.warn("[KeyManager] No VITE_GEMINI_KEYS found in env");
      return;
    }
    const parsed = raw.split(",").map((k) => k.trim()).filter(Boolean);
    if (parsed.length === 0) {
      console.warn("[KeyManager] VITE_GEMINI_KEYS is empty");
      return;
    }
    this.keys = parsed.map((k) => ({
      key: k,
      requestsToday: 0,
      dailyCap: DAILY_CAP,
      cooldownUntil: 0,
      lastError: null,
    }));
    console.log(`[KeyManager] Loaded ${this.keys.length} key(s)`);
  }

  get availableCount(): number {
    return this.keys.filter((k) => this.isAvailable(k)).length;
  }

  get totalCount(): number {
    return this.keys.length;
  }

  private isAvailable(k: KeyState): boolean {
    if (k.requestsToday >= k.dailyCap) return false;
    if (Date.now() < k.cooldownUntil) return false;
    return true;
  }

  private checkReset(): void {
    if (Date.now() - this.lastReset > RESET_INTERVAL_MS) {
      this.keys.forEach((k) => {
        k.requestsToday = 0;
        k.cooldownUntil = 0;
        k.lastError = null;
      });
      this.currentIndex = 0;
      this.lastReset = Date.now();
    }
  }

  pickKey(): { key: string; index: number } | null {
    this.checkReset();

    if (this.keys.length === 0) return null;

    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.currentIndex + i) % this.keys.length;
      if (this.isAvailable(this.keys[idx])) {
        this.currentIndex = idx;
        this.keys[idx].requestsToday++;
        return { key: this.keys[idx].key, index: idx };
      }
    }

    return null;
  }

  markFailed(index: number, error: string): void {
    if (index < 0 || index >= this.keys.length) return;
    const k = this.keys[index];

    if (error.includes("429") || error.includes("RESOURCE_EXHAUSTED") || error.includes("rate")) {
      k.cooldownUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
      k.lastError = "Rate limited — cool down 60s";
    } else if (error.includes("403") || error.includes("daily") || error.includes("quota")) {
      k.requestsToday = k.dailyCap;
      k.lastError = "Daily cap reached";
    } else {
      k.lastError = error.slice(0, 100);
    }
  }

  getStatus(): { index: number; remaining: number; total: number; states: { available: boolean; requestsToday: number; error: string | null }[] } {
    const states = this.keys.map((k) => ({
      available: this.isAvailable(k),
      requestsToday: k.requestsToday,
      error: k.lastError,
    }));
    return {
      index: this.currentIndex,
      remaining: this.availableCount,
      total: this.totalCount,
      states,
    };
  }
}

export const keyManager = new KeyManager();
