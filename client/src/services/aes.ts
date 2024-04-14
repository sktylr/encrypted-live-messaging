export const encryptSymmetric = async (plaintext: string, key: string) => {
    const initialisationVector = getInitialisationVector();

    const encodedPlaintext = new TextEncoder().encode(plaintext);

    // key is stored in base64 raw encoding so needs to be converted beforehand
    const secretKey = await importKey(key);

    const ciphertext = await crypto.subtle.encrypt(getAlgorithm(initialisationVector), secretKey, encodedPlaintext);

    // base64 encode before returning for easy network transfer
    return {
        ciphertext: Buffer.from(ciphertext).toString('base64'),
        iv: Buffer.from(initialisationVector).toString('base64'),
    };
};

export const decryptSymmetric = async (ciphertext: string, iv: string, key: string) => {
    const secretKey = await importKey(key);

    const plaintext = await crypto.subtle.decrypt(
        getAlgorithm(Buffer.from(iv, 'base64')),
        secretKey,
        Buffer.from(ciphertext, 'base64'),
    );

    return new TextDecoder().decode(plaintext);
};

// generate a random initialisation vector -> required for AES to prevent duplicate plaintexts being encrypted to the same
// cipher text with the same key.
// must be 128 bits -> 16 * 8 = 128
export const getInitialisationVector = () => crypto.getRandomValues(new Uint8Array(16));

const importKey = async (key: string) =>
    await crypto.subtle.importKey(
        'raw',
        Buffer.from(key, 'base64'),
        {
            name: 'AES-CBC',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    );

const getAlgorithm = (initialisationVector: BufferSource) => ({ name: 'AES-CBC', iv: initialisationVector });
