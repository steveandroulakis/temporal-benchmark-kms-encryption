import * as wf from '@temporalio/workflow';

import type * as activities from './activities';

const { getRandomNumbers } = wf.proxyActivities<typeof activities>({
    startToCloseTimeout: '5 seconds',
    retry: {
    }
  });

export const approveSignal = wf.defineSignal('approve');

/** Temporal Version of AWS Step Functions example: 
 * https://docs.aws.amazon.com/step-functions/latest/dg/sample-lambda-orchestration.html */
export async function benchmarkEncryptionWorkflow(): Promise<string> {

  const randomNumbers = await getRandomNumbers(100);

  return randomNumbers.join(', ');

}