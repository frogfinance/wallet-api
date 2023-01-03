// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ethereumServiceSingleton } from '../../services';
import EthereumService from '../../services/ethereum.service';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

const testAccountsByNetwork = {
  goerli: '0xDa128dA45977ea375405De0553d7660afA1cE674',
  mainnet: '0xDa128dA45977ea375405De0553d7660afA1cE674',
};

describe('Integration testing Ethereum Service - return ethereum account data, transactions, erc tokens etc [INT]', () => {
  describe('service layer', () => {
    it('get account balance - requires ALCHEMY API KEY', async () => {
      const service: EthereumService = ethereumServiceSingleton;
      const data = await service.getAccountBalance(testAccountsByNetwork['goerli']);
      expect(data.account).toBe(testAccountsByNetwork['goerli']);
      expect(data.balance.length).toBeGreaterThan(0);
    });
  });
});
