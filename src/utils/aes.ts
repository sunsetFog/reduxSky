// 按需引用crypto-js相关功能，可以减少bundle大小
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import MD5 from 'crypto-js/md5';
import { toLower } from 'lodash';
// noinspection SpellCheckingInspection
const secretPhrase = 'zSg!^bGyclC^2nES';

/**
 * 解密方法
 * @return {string}
 */
export function decrypt(text) {
  if (!text) {
    return text;
  }
  const key = encUtf8.parse(secretPhrase);
  const iv = encUtf8.parse(secretPhrase);
  return AES.decrypt(text, key, {
    iv,
    padding: pkcs7,
  }).toString(encUtf8);
}

/**
 * 加密方法
 * @return {string}
 */
export function encrypt(text) {
  if (!text) {
    return text;
  }
  const key = encUtf8.parse(secretPhrase);
  const iv = encUtf8.parse(secretPhrase);
  return AES.encrypt(text, key, {
    iv,
    padding: pkcs7,
  }).toString();
}

export function EncryptMD5(text) {
  return MD5(toLower(text)).toString();
}

