import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
} from 'crypto';

const alg = 'aes-256-ctr';
let key = 'The Encryption Key';
key = createHash('sha256').update(String(key)).digest('base64').substr(0, 32);

export const encrypt = (data) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(alg, key, iv);
  const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
  return result;
};

export const decrypt = (data) => {
  const iv = data.slice(0, 16);
  data = data.slice(16);
  const decipher = createDecipheriv(alg, key, iv);
  const result = Buffer.concat([decipher.update(data), decipher.final()]);
  return result;
};

export async function sendMessage(message: string): Promise<object> {
  const encryptedMessage = encrypt(message);
  const decrytedMessage = decrypt(encryptedMessage);
  return {
    'Encryted Message': encryptedMessage.toString(),
    'Decryted Message': decrytedMessage.toString(),
  };
}