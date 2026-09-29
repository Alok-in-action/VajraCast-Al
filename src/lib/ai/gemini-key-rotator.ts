export class GeminiKeyRotator {
  private keys: string[] = [];
  private currentKeyIndex = 0;

  constructor() {
    // Load up to 10 keys from env vars
    for (let i = 1; i <= 10; i++) {
      const key = process.env[`GEMINI_API_KEY_${i}`];
      if (key) {
        this.keys.push(key);
      }
    }
    
    // Fallback to standard GEMINI_API_KEY if specific ones aren't set
    if (this.keys.length === 0 && process.env.GEMINI_API_KEY) {
      this.keys.push(process.env.GEMINI_API_KEY);
    }
    
    if (this.keys.length === 0) {
      console.warn("No Gemini API keys found in environment variables.");
    }
  }

  getCurrentKey(): string | null {
    if (this.keys.length === 0) return null;
    return this.keys[this.currentKeyIndex];
  }

  rotateKey(): void {
    if (this.keys.length > 1) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
      console.log(`Rotated to Gemini API key index: ${this.currentKeyIndex}`);
    }
  }
  
  getAvailableKeyCount(): number {
    return this.keys.length;
  }
}

export const keyRotator = new GeminiKeyRotator();
