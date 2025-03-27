export declare class AppController {
    otpEncrypt(body: {
        text: string;
    }): {
        ciphertext: string;
        key: string;
    };
    otpDecrypt(body: {
        ciphertext: string;
        key: string;
    }): {
        error: string;
        plaintext?: undefined;
    } | {
        plaintext: string;
        error?: undefined;
    };
    private tripleDes;
    tripleDesEncrypt(body: {
        text: string;
        key: string;
    }): {
        result: string;
        iv: string;
    };
    tripleDesDecrypt(body: {
        text: string;
        key: string;
        iv: string;
    }): {
        result: string;
        iv: string;
    };
    private aes;
    aesEncrypt(body: {
        text: string;
        key: string;
    }): {
        result: string;
        iv: string;
    };
    aesDecrypt(body: {
        text: string;
        key: string;
        iv: string;
    }): {
        result: string;
        iv: string;
    };
}
