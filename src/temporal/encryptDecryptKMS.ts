import {
    KmsKeyringNode,
    buildClient,
    CommitmentPolicy,
    AlgorithmSuiteIdentifier
} from '@aws-crypto/client-node';

interface AlgorithmCommitmentPair {
    suiteName: string;
    algorithmSuite: AlgorithmSuiteIdentifier;
    commitmentPolicy: CommitmentPolicy;
}

export const algorithmCommitmentPairs =
    [
        {
            suiteName: 'ALG_AES128_GCM_IV12_TAG16',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES128_GCM_IV12_TAG16,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES128_GCM_IV12_TAG16_HKDF_SHA256',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES128_GCM_IV12_TAG16_HKDF_SHA256,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES128_GCM_IV12_TAG16_HKDF_SHA256_ECDSA_P256',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES128_GCM_IV12_TAG16_HKDF_SHA256_ECDSA_P256,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES192_GCM_IV12_TAG16',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES192_GCM_IV12_TAG16,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES192_GCM_IV12_TAG16_HKDF_SHA256',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES192_GCM_IV12_TAG16_HKDF_SHA256,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES192_GCM_IV12_TAG16_HKDF_SHA384_ECDSA_P384',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES192_GCM_IV12_TAG16_HKDF_SHA384_ECDSA_P384,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES256_GCM_IV12_TAG16',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES256_GCM_IV12_TAG16_HKDF_SHA256',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16_HKDF_SHA256,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES256_GCM_IV12_TAG16_HKDF_SHA384_ECDSA_P384',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16_HKDF_SHA384_ECDSA_P384,
            commitmentPolicy: CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT,
        },
        {
            suiteName: 'ALG_AES256_GCM_IV12_TAG16_HKDF_SHA512_COMMIT_KEY',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16_HKDF_SHA512_COMMIT_KEY,
            commitmentPolicy: CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT,
        },
        {
            suiteName: 'ALG_AES256_GCM_IV12_TAG16_HKDF_SHA512_COMMIT_KEY_ECDSA_P384',
            algorithmSuite: AlgorithmSuiteIdentifier.ALG_AES256_GCM_IV12_TAG16_HKDF_SHA512_COMMIT_KEY_ECDSA_P384,
            commitmentPolicy: CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT,
        }
    ];

export class EncryptionClient {
    private encrypt: any;
    private decrypt: any;
    private keyring: KmsKeyringNode;
    private context: { [key: string]: string };
    private algorithmCommitmentPair: AlgorithmCommitmentPair;

    constructor(algorithmCommitmentPair: AlgorithmCommitmentPair) {
        this.algorithmCommitmentPair = algorithmCommitmentPair;
        // console.log(`Algorithm Suite: ${algorithmCommitmentPair.suiteName}`);
        // console.log(`Commitment Policy: ${algorithmCommitmentPair.commitmentPolicy}`);

        const { encrypt, decrypt } = buildClient(algorithmCommitmentPair.commitmentPolicy);
        this.encrypt = encrypt;
        this.decrypt = decrypt;

        const generatorKeyId: string = 'arn:aws:kms:us-west-2:429214323166:key/05386783-6922-4296-9c03-da31627b6a60';
        const keyIds: string[] = ['arn:aws:kms:us-west-2:658956600833:alias/EncryptDecrypt'];
        this.keyring = new KmsKeyringNode({ generatorKeyId, keyIds });

        this.context = {
            stage: 'demo',
            purpose: 'simple demonstration app',
            origin: 'us-west-2',
        };
    }

    public async encryptPayload(data: Uint8Array): Promise<Uint8Array> {
        const encryptionResult = `${this.algorithmCommitmentPair.suiteName},${this.algorithmCommitmentPair.commitmentPolicy},encrypt,`;
        console.time(encryptionResult);
        const cleartext = Buffer.from(data);
        const { result } = await this.encrypt(this.keyring, cleartext, {
            encryptionContext: this.context,
            suiteId: this.algorithmCommitmentPair.algorithmSuite,
        });
        console.timeEnd(encryptionResult);
        return Uint8Array.from(result);
    }

    public async decryptPayload(ciphertext: Uint8Array): Promise<Uint8Array> {
        const decryptionResult = `${this.algorithmCommitmentPair.suiteName},${this.algorithmCommitmentPair.commitmentPolicy},decrypt,`;
        console.time(decryptionResult);
        const { plaintext } = await this.decrypt(this.keyring, Buffer.from(ciphertext));
        console.timeEnd(decryptionResult);
        return Uint8Array.from(plaintext);
    }
}

