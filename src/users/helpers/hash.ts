import * as bcrypt from "bcrypt";
import crypto, {randomBytes} from "crypto";
export function hash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    if (password) {
      bcrypt.hash(password.toString(), saltRounds, function(e: Error, hash: string) {
        if (e) {
          reject(e);
        }
        resolve(hash);
      });
    }
  });
}

export function compare(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (e: Error, isMatch: boolean) {
      if (e) {
        reject(e);
      }
      resolve(isMatch);
    })
  });
}

export function createRandomToken(): Promise<string> {
  return new Promise((resolve) => {
    randomBytes(16, (err:Error | null, buf: Buffer) => {
      resolve(buf.toString("hex"));
    });
  });
}