import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';

export function generateRecoveryPhrase(): string {
  return bip39.generateMnemonic();
}

export function hashRecoveryPhrase(phrase: string): string {
  return CryptoJS.SHA256(phrase.trim()).toString();
}

export function validateRecoveryPhrase(phrase: string): boolean {
  return bip39.validateMnemonic(phrase);
}

export function getRandomWordsForConfirmation(phrase: string, count: number = 3): number[] {
  const words = phrase.split(' ');
  const indices: number[] = [];
  
  while (indices.length < count) {
    const randomIndex = Math.floor(Math.random() * words.length);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  
  return indices.sort((a, b) => a - b);
}
