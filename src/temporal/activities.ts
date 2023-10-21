import fetch from 'node-fetch-commonjs';
import { getConfig } from './config';
import { config } from 'dotenv';
import { resolve } from 'path';

const path = process.env.NODE_ENV === 'production'
  ? resolve(__dirname, '../../.env.production')
  : resolve(__dirname, '../../.env.development');

config({ path });

const configObj = getConfig();

// activity that returns a list of random numbers
export const getRandomNumbers = async (count: number): Promise<number[]> => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(Math.random());
  }
  return result;
};
