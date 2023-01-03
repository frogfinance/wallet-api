import { ethers } from 'ethers';
import { ETHEREUM_RPC_URL } from '@config';

const provider = ethers.providers.getDefaultProvider(ETHEREUM_RPC_URL);

export const generateEthWallet = () => {
  return ethers.Wallet.createRandom();
};

export const transactionGasEstimate = async ({ tx, key }) => {
  const wallet = new ethers.Wallet(key, provider);
  return await wallet.estimateGas(tx);
};

export const submitTransaction = async ({ tx, key, gasEstimate }) => {
  const wallet = new ethers.Wallet(key, provider);

  // const gasPrice = provider.getGasPrice();
  const txData = {
    nonce: provider.getTransactionCount(wallet.publicKey, 'latest'),
    gasPrice: gasEstimate,
    ...tx,
  };
  const signedTx = await wallet.signTransaction(txData);

  const transactionResponse = await provider.sendTransaction(signedTx);
  return transactionResponse;
};
