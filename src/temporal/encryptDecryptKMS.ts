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

// Usage example
const runExample = async () => {
    const cleartext = new Uint8Array([97, 115, 100, 102]); // 'asdf' in ASCII
    const encrypted = await encryptPayload(cleartext);
    const decrypted = await decryptPayload(encrypted);

    console.log(`Cleartext: ${String.fromCharCode.apply(null, Array.from(cleartext))}`);
    console.log(`Encrypted: ${Buffer.from(encrypted).toString('base64')}`);
    console.log(`Decrypted: ${String.fromCharCode.apply(null, Array.from(decrypted))}`);
};

runExample();
