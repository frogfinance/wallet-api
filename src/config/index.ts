import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const NETWORK = process.env.NETWORK || 'goerli';
export const IS_MAINNET = NETWORK === 'mainnet';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'GAQTR2TKP2WWFWGDPPEQIX5FTTXBPM3IFC';
export const INFURA_API_KEY = process.env.INFURA_API_KEY || '1ec3540ec7e44281b699d5e0b216e346';
export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || 'pQR_Smh-i2GyP8H-90dCC1h5Ihcs378S';
export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://goerli.infura.io/v3/1ec3540ec7e44281b699d5e0b216e346';
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || '';
export const JWT_ALGORITHM = 'HS384';
export const { ENV, NODE_ENV, PORT, SECRET_KEY, LOG_LEVEL, LOG_FORMAT, REDIS_URL, ORIGIN, RPC_USER, RPC_PASSWORD, RPC_URL, PRIVATE_RPC_URL } =
  process.env;
