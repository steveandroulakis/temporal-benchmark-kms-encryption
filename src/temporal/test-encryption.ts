import { EncryptionClient, algorithmCommitmentPairs } from "./encryptDecryptKMS";

// Utility functions
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

// Usage
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const runExample = async (payload: string) => {
    for (const algorithmCommitmentPair of algorithmCommitmentPairs) {
        const encryptionClient = new EncryptionClient(
            algorithmCommitmentPair
        );

        let encrypted: Uint8Array = new Uint8Array();
        const cleartext = stringToAsciiArray(payload);

        for (const i of Array(300).keys()) {
                encrypted = await encryptionClient.encryptPayload(cleartext);
                const decrypted = await encryptionClient.decryptPayload(encrypted);
        }
        await delay(1000);
    }
};


const fs = require('fs');
const path = require('path');

// from https://github.com/Azure-Samples/azure-search-sample-data/blob/main/hotels/HotelsData_toAzureSearch.JSON
const filePath = path.join(__dirname, 'sample_payload_HotelsData_toAzureSearch.json');

fs.readFile(filePath, 'utf8', function (err: any, data: any) {
    if (err) {
        return console.log(err);
    }
    console.log('ok');
    runExample(data);
});