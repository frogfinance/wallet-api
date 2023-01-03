import crypto from 'crypto';

const encryptionAlgorithm = 'aes-256-cbc';

export const encrypt = ({ text, salt, keySalt, pin }) => {
  const key = crypto.scryptSync(pin, keySalt, 32);
  const cipher = crypto.createCipheriv(encryptionAlgorithm, key, salt);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString('hex');
};

export const decrypt = ({ hash, salt, keySalt, pin }) => {
  const key = crypto.scryptSync(pin, keySalt, 32);
  const decipher = crypto.createDecipheriv(encryptionAlgorithm, key, salt);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
  return decrypted.toString();
};

export const generateRandomKey = (n = 32) => crypto.randomBytes(n);
