import App from '../../app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from 'supertest';
import { tokensServiceSingleton } from '../../services';
import TokensService from '../../services/tokens.service';
import TokensRoute from '../../routes/tokens.route';

const tokenService: TokensService = tokensServiceSingleton;

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Integration Testing Token Ticker data - return token ticker data from Coingecko [INT]', () => {
  describe('[Get] /token/tickers', () => {
    it('response with valid token data', async () => {
      const tokensRoute = new TokensRoute();
      const app = new App([tokensRoute]);
      const response = await request(app.getServer()).get(`${tokensRoute.path}/tickers`).query({ tokens: 'ethereum' });
      expect(response.status).toEqual(200);
    });

    it('response with valid token prices', async () => {
      const tokensRoute = new TokensRoute();
      const app = new App([tokensRoute]);
      const response = await request(app.getServer()).get(`${tokensRoute.path}/prices`).query({ tokens: 'ethereum,bitcoin,bnb' });
      expect(response.status).toEqual(200);
    });
  });
});
