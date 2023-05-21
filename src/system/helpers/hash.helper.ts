import * as CryptoJS from 'crypto-js';

export class HashHelper {
  static encryptAES(decodedString: string, salt: string): string {
    return CryptoJS.AES.encrypt(decodedString, salt).toString();
  }

  static decryptAES(encodedString: string, salt: string): string {
    return CryptoJS.AES.decrypt(encodedString, salt).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
