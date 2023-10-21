import {
    KmsKeyringNode,
    buildClient,
    CommitmentPolicy,
    AlgorithmSuiteIdentifier
} from '@aws-crypto/client-node';

const { encrypt, decrypt } = buildClient(
    CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
    // CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT
);

const generatorKeyId: string = 'arn:aws:kms:us-west-2:429214323166:key/05386783-6922-4296-9c03-da31627b6a60';
const keyIds: string[] = ['arn:aws:kms:us-west-2:658956600833:alias/EncryptDecrypt'];

const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });

const context: { [key: string]: string } = {
    stage: 'demo',
    purpose: 'simple demonstration app',
    origin: 'us-west-2',
};

export async function encryptPayload(data: Uint8Array): Promise<Uint8Array> {
    console.time('Encryption Time'); // Start timer for encryption
    const cleartext = Buffer.from(data);
    const { result } = await encrypt(keyring, cleartext, {
        encryptionContext: context,
        suiteId: AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16_HKDF_SHA512_COMMIT_KEY_ECDSA_P384,
        // suiteId: AlgorithmSuiteIdentifier.ALG_AES128_GCM_IV12_TAG16_HKDF_SHA256,
    });
    console.timeEnd('Encryption Time'); // End timer for encryption
    return Uint8Array.from(result);
}

export async function decryptPayload(ciphertext: Uint8Array): Promise<Uint8Array> {
    console.time('Decryption Time'); // Start timer for decryption
    const { plaintext } = await decrypt(keyring, Buffer.from(ciphertext));
    console.timeEnd('Decryption Time'); // End timer for decryption
    return Uint8Array.from(plaintext);
}

function stringToAsciiArray(str: string): Uint8Array {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
}

function base64ToUint8Array(base64String: string): Uint8Array {
    const buffer = Buffer.from(base64String, 'base64');
    return Uint8Array.from(buffer);
}  

// Usage example
const runExample = async () => {
    const myString = "asdf";
    const cleartext = stringToAsciiArray(myString);
    const encrypted = await encryptPayload(cleartext);
    const decrypted = await decryptPayload(encrypted);

    console.log(`Cleartext: ${String.fromCharCode.apply(null, Array.from(cleartext))}`);
    console.log(`Encrypted: ${Buffer.from(encrypted).toString('base64')}`);
    console.log(`Decrypted: ${String.fromCharCode.apply(null, Array.from(decrypted))}`);

    const hardcodedBase64Encrypted = "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";
    const asciiencryptedString = base64ToUint8Array(hardcodedBase64Encrypted);
    const decryptedString = await decryptPayload(asciiencryptedString);
    console.log(`Decrypted (hardcoded): ${String.fromCharCode.apply(null, Array.from(decryptedString))}`);
};

// runExample();
