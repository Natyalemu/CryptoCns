// backend/src/app.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import * as crypto from 'crypto';

@Controller()
export class AppController {
  // OTP Encryption
  @Post('otp-encrypt')
  otpEncrypt(@Body() body: { text: string }) {
    const textBuffer = Buffer.from(body.text, 'utf8');
    const key = crypto.randomBytes(textBuffer.length);
    const ciphertext = Buffer.alloc(textBuffer.length);
    for (let i = 0; i < textBuffer.length; i++) {
      ciphertext[i] = textBuffer[i] ^ key[i];
    }
    return {
      ciphertext: ciphertext.toString('base64'),
      key: key.toString('base64')
    };
  }

  // OTP Decryption
  @Post('otp-decrypt')
  otpDecrypt(@Body() body: { ciphertext: string; key: string }) {
    const ciphertext = Buffer.from(body.ciphertext, 'base64');
    const key = Buffer.from(body.key, 'base64');
    if (ciphertext.length !== key.length) {
      return { error: 'Key length does not match ciphertext length' };
    }
    const plaintextBuffer = Buffer.alloc(ciphertext.length);
    for (let i = 0; i < ciphertext.length; i++) {
      plaintextBuffer[i] = ciphertext[i] ^ key[i];
    }
    return { plaintext: plaintextBuffer.toString('utf8') };
  }

  // 3DES Encryption/Decryption
  private tripleDes(mode: 'encrypt' | 'decrypt', text: string, key: string, ivHex?: string) {
    const iv = ivHex ? Buffer.from(ivHex, 'hex') : crypto.randomBytes(8);
    const cipher = mode === 'encrypt'
      ? crypto.createCipheriv('des-ede3-cbc', Buffer.from(key, 'hex'), iv)
      : crypto.createDecipheriv('des-ede3-cbc', Buffer.from(key, 'hex'), iv);
    let result = cipher.update(
      text,
      mode === 'encrypt' ? 'utf8' : 'base64',
      mode === 'encrypt' ? 'base64' : 'utf8'
    );
    result += cipher.final(mode === 'encrypt' ? 'base64' : 'utf8');
    return { result, iv: iv.toString('hex') };
  }

  @Post('3des-encrypt')
  tripleDesEncrypt(@Body() body: { text: string; key: string }) {
    return this.tripleDes('encrypt', body.text, body.key);
  }

  @Post('3des-decrypt')
  tripleDesDecrypt(@Body() body: { text: string; key: string; iv: string }) {
    return this.tripleDes('decrypt', body.text, body.key, body.iv);
  }

  // AES Encryption/Decryption
  private aes(mode: 'encrypt' | 'decrypt', text: string, key: string, ivHex?: string) {
    const iv = ivHex ? Buffer.from(ivHex, 'hex') : crypto.randomBytes(16);
    const cipher = mode === 'encrypt'
      ? crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
      : crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let result = cipher.update(
      text,
      mode === 'encrypt' ? 'utf8' : 'base64',
      mode === 'encrypt' ? 'base64' : 'utf8'
    );
    result += cipher.final(mode === 'encrypt' ? 'base64' : 'utf8');
    return { result, iv: iv.toString('hex') };
  }

  @Post('aes-encrypt')
  aesEncrypt(@Body() body: { text: string; key: string }) {
    return this.aes('encrypt', body.text, body.key);
  }

  @Post('aes-decrypt')
  aesDecrypt(@Body() body: { text: string; key: string; iv: string }) {
    return this.aes('decrypt', body.text, body.key, body.iv);
  }
}
