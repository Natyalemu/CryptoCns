"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let AppController = class AppController {
    otpEncrypt(body) {
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
    otpDecrypt(body) {
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
    tripleDes(mode, text, key, ivHex) {
        const iv = ivHex ? Buffer.from(ivHex, 'hex') : crypto.randomBytes(8);
        const cipher = mode === 'encrypt'
            ? crypto.createCipheriv('des-ede3-cbc', Buffer.from(key, 'hex'), iv)
            : crypto.createDecipheriv('des-ede3-cbc', Buffer.from(key, 'hex'), iv);
        let result = cipher.update(text, mode === 'encrypt' ? 'utf8' : 'base64', mode === 'encrypt' ? 'base64' : 'utf8');
        result += cipher.final(mode === 'encrypt' ? 'base64' : 'utf8');
        return { result, iv: iv.toString('hex') };
    }
    tripleDesEncrypt(body) {
        return this.tripleDes('encrypt', body.text, body.key);
    }
    tripleDesDecrypt(body) {
        return this.tripleDes('decrypt', body.text, body.key, body.iv);
    }
    aes(mode, text, key, ivHex) {
        const iv = ivHex ? Buffer.from(ivHex, 'hex') : crypto.randomBytes(16);
        const cipher = mode === 'encrypt'
            ? crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
            : crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let result = cipher.update(text, mode === 'encrypt' ? 'utf8' : 'base64', mode === 'encrypt' ? 'base64' : 'utf8');
        result += cipher.final(mode === 'encrypt' ? 'base64' : 'utf8');
        return { result, iv: iv.toString('hex') };
    }
    aesEncrypt(body) {
        return this.aes('encrypt', body.text, body.key);
    }
    aesDecrypt(body) {
        return this.aes('decrypt', body.text, body.key, body.iv);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('otp-encrypt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "otpEncrypt", null);
__decorate([
    (0, common_1.Post)('otp-decrypt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "otpDecrypt", null);
__decorate([
    (0, common_1.Post)('3des-encrypt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "tripleDesEncrypt", null);
__decorate([
    (0, common_1.Post)('3des-decrypt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "tripleDesDecrypt", null);
__decorate([
    (0, common_1.Post)('aes-encrypt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "aesEncrypt", null);
__decorate([
    (0, common_1.Post)('aes-decrypt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "aesDecrypt", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map