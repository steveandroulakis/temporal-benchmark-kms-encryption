## Temporal Sample: Benchmark KMS Encryption SDK Algorithm Suites

Benchmarks the AWS KMS Encryption SDK with different algorithm suites, when encoding/decoding Temporal payloads.
* Runs each of the 11 encryption algorithms 600 times (half encryption, half decryption) `./src/temporal/test-encryption.ts`
* A Temporal DataConverter that uses KMS and the Encryption SDK to encrypt/decrypt payloads `encryptDecryptKMS.ts`
* AWS CDK code for deploying a KMS CMK and alias `./deploy`

TODO: KMS key arn is hard-coded in encryptDecryptKMS.ts, make env var
TODO: Algorithm suite choice is hard-coded in encryptDecryptKMS.ts, make env var and record in workflow
TODO: Benchmark results are console logged as strings, make them a typed object and record in workflow
TODO: Codec Server

#### Deploy AWS KMS CMKs
See `README.md` in the `deploy` directory for AWS CDK instructions.

#### Configuration
- Copy the `.env_example` file to `.env.development` and change settings to match your temporal installation.
- Omit CERT_PATH, KEY_PATH, ADDRESS, NAMESPACE to use a local Temporal Server

#### Run a Temporal Server ([Guide](https://docs.temporal.io/kb/all-the-ways-to-run-a-cluster#temporal-cli))
- `brew install temporal`
- `temporal server start-dev` (Temporal Server web UI: localhost:8233)

#### Install Dependencies
- `npm install`

#### Run a Developer environment
  - `npm run start`

#### Run workers (required to execute workflows)
  - `npm run worker`

You need to be logged into the AWS CLI with an account that has access to the KMS key you created in the deploy step.

#### Start a workflow
- Go to the debug interface: `http://localhost:3000/runWorkflow`
- Watch the worker log output for encryption/decryption benchmark results

#### (Advanced) Debug/replay Workflow histories with the [Temporal VSCode Extension](https://marketplace.visualstudio.com/items?itemName=temporal-technologies.temporalio)
- Open the project root as a VSCode project
- Run the replayer on a downloaded workflow JSON file
