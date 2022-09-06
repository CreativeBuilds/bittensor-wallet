import crypto from 'crypto'

const method = 'aes-256-ctr'

export const encrypt = (text: string, secretKey: string) => {
    const iv = crypto.randomBytes(16);

    let key = GenerateKey(secretKey);

    const cipher = crypto.createCipheriv(method, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

export const decrypt =  (hash: { iv: string, content: string }, secretKey: string) => {
    const decipher = crypto.createDecipheriv(method, GenerateKey(secretKey), Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
}

function GenerateKey(secretKey: string) {
    return crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);
}
