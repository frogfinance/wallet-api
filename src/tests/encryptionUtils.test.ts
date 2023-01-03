import { ethers } from 'ethers';
import { decrypt, encrypt, generateRandomKey } from '../utils/encryptionUtils';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing encryption module', () => {
  describe('encrypt', () => {
    it('should encrypt the given text string', () => {
      const w = ethers.Wallet.createRandom();
      const text = w.privateKey;
      const salt = generateRandomKey(16);
      const keySalt = generateRandomKey(32);
      const pin = '617791';
      const encrypted = encrypt({ text, salt, keySalt, pin });
      expect(encrypted).toBeDefined();
    });
  });

  describe('decrypt', () => {
    it('should decrypt a private key', () => {
      const w = ethers.Wallet.createRandom();
      const text = w.privateKey;
      const salt = generateRandomKey(16);
      const keySalt = generateRandomKey(32);
      const pin = '616691';
      const encrypted = encrypt({ text, salt, keySalt, pin });
      const decrypted = decrypt({ hash: encrypted, salt, keySalt, pin });
      expect(decrypted).toEqual(text);
    });
  });
});
