import CryptoJS from 'crypto-js';
import { ENV } from '../config/env';

export const encryptPassword = (password: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, ENV.encryptionKey);
    return encrypted.toString();
  } catch {
    return password;
  }
};

export const decryptPassword = (encryptedPassword: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, ENV.encryptionKey);
    const password = decrypted.toString(CryptoJS.enc.Utf8);

    // If decryption fails, it returns empty string
    if (!password) {
      return '';
    }

    return password;
  } catch {
    return '';
  }
};
