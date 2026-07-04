import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..", "..", "..");

const DAILY_CAP = 1500;
const RATE_LIMIT_COOLDOWN_MS = 60_000;
const RESET_INTERVAL_MS = 86_400_000;

function loadKeysFromEnv() {
  const keys = process.env.GEMINI_KEYS;
  if (keys) return keys.split(",").map((k) => k.trim()).filter(Boolean);

  const envPath = resolve(PROJECT_ROOT, ".env.local");
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    const match = content.match(/^VITE_GEMINI_KEYS\s*=\s*(.+)$/m);
    if (match) {
      return match[1].split(",").map((k) => k.trim()).filter(Boolean);
    }
  }

  return [];
}

export class GeminiApiKeyManager {
  constructor() {
    this.keys = [];
    this.currentIndex = 0;
    this.lastReset = Date.now();

    const parsed = loadKeysFromEnv();
    if (parsed.length === 0) {
      console.warn("[KeyManager] No Gemini API keys found");
      return;
    }

    this.keys = parsed.map((k) => ({
      key: k,
      requestsToday: 0,
      dailyCap: DAILY_CAP,
      cooldownUntil: 0,
      lastError: null,
    }));

    console.log(`[KeyManager] Loaded ${this.keys.length} API key(s)`);
  }

  get availableCount() {
    return this.keys.filter((k) => this._isAvailable(k)).length;
  }

  get totalCount() {
    return this.keys.length;
  }

  _isAvailable(k) {
    if (k.requestsToday >= k.dailyCap) return false;
    if (Date.now() < k.cooldownUntil) return false;
    return true;
  }

  _checkReset() {
    if (Date.now() - this.lastReset > RESET_INTERVAL_MS) {
      this.keys.forEach((k) => {
        k.requestsToday = 0;
        k.cooldownUntil = 0;
        k.lastError = null;
      });
      this.currentIndex = 0;
      this.lastReset = Date.now();
      console.log("[KeyManager] Daily reset applied");
    }
  }

  pickKey() {
    this._checkReset();

    if (this.keys.length === 0) return null;

    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.currentIndex + i) % this.keys.length;
      const keyState = this.keys[idx];
      if (this._isAvailable(keyState)) {
        this.currentIndex = idx;
        keyState.requestsToday++;
        return { key: keyState.key, index: idx };
      }
    }

    return null;
  }

  markFailed(index, error) {
    if (index < 0 || index >= this.keys.length) return;

    const k = this.keys[index];

    if (error.includes("429") || error.includes("RESOURCE_EXHAUSTED") || error.includes("rate")) {
      k.cooldownUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
      k.lastError = "Rate limited — cooling down for 60s";
      console.warn(`[KeyManager] Key ${index} rate limited, cooling down`);
    } else if (error.includes("403") || error.includes("daily") || error.includes("quota")) {
      k.requestsToday = k.dailyCap;
      k.lastError = "Daily cap reached";
      console.warn(`[KeyManager] Key ${index} daily cap reached`);
    } else {
      k.lastError = String(error).slice(0, 100);
      console.warn(`[KeyManager] Key ${index} failed: ${k.lastError}`);
    }
  }

  getStatus() {
    return {
      index: this.currentIndex,
      remaining: this.availableCount,
      total: this.totalCount,
      states: this.keys.map((k) => ({
        available: this._isAvailable(k),
        requestsToday: k.requestsToday,
        error: k.lastError,
      })),
    };
  }
}

export const keyManager = new GeminiApiKeyManager();
