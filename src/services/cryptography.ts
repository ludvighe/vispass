import { SHA3, SHAKE } from "sha3";
import { Buffer } from "buffer";

import CryptoJS from "crypto-js";

//==== ENCRYPT & DECRYPT ====//

/** Simple AES encryption. Returns data encrypted with secretKey as string. */
export const encryptAES = (data: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

/** Simple AES decryption. Returns data decrypted with secretKey as string. */
export const decryptAES = (cipher: string, secretKey: string) => {
  return CryptoJS.AES.decrypt(cipher, secretKey).toString(CryptoJS.enc.Utf8);
};

//==== HASHING ====//

/** Returns random string of given length. */
export const generateSalt = (length: number = 256) => {
  const arr = new Uint8Array(length / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};

/** Returns given data hashed to hexstring with SHA3(512). */
export const generateSHA3Hash = (data: string) => {
  const hash = new SHA3(512);
  hash.update(data);
  const buffer = hash.digest("hex");
  return buffer;
};

/** Returns given data hashed to hexstring with SH128. */
export const generateSHAKE128Hash = (
  data: string,
  bufferAlloc: number = 1024
) => {
  const hash = new SHAKE();
  hash.update(data);
  const buffer = hash.digest({
    buffer: (window.Buffer || Buffer).alloc(bufferAlloc),
    format: "hex",
  });
  return buffer;
};

//==== UUID ====//

export const generateUUID = () => {
  return crypto.randomUUID();
};

//==== UTILS ====//

const dec2hex = (dec: any) => {
  return dec.toString(16).padStart(2, "0");
};
