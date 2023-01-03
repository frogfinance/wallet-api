import axios from 'axios';
import { logger } from '@utils/logger';

export interface TokenTickerData {
  id: string;
  symbol: string;
  name: string;
  description: object;
  coingecko_rank: number;
  tickers: object;
  market_data: object;
}

axios.interceptors.request.use(request => {
  logger.debug(`Axios Starting Request ${JSON.stringify(request, null, 2)}`);
  return request;
});

axios.interceptors.response.use(response => {
  const responseInfo = { status: response.status, data: response.data, headers: response.headers };
  logger.debug(`Axios Response ${JSON.stringify(responseInfo, null, 2)}`);
  return response;
});

class TokensService {
  private coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';

  public async getTokenTickers(tokens: string): Promise<TokenTickerData[]> {
    const tokenList = tokens.split(',');
    const queryParams = {
      localization: false,
      tickers: true,
      market_data: true,
      community_data: false,
      developer_data: true,
      sparkline: false,
    };
    const tokenData: TokenTickerData[] = [];
    for (const t of tokenList) {
      const url = `${this.coingeckoBaseUrl}/coins/${t}`;
      const tokenTickerData = await this.queryCoingeckoApi(url, queryParams);
      const data: TokenTickerData = { ...tokenTickerData };
      tokenData.push(data);
    }
    return tokenData;
  }

  public async getTokenPrices(tokens: string): Promise<any> {
    const queryParams = {
      ids: tokens,
      vs_currencies: 'usd,eth',
      include_market_cap: true,
      include_24hr_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
      precision: 'full',
    };
    const url = `${this.coingeckoBaseUrl}/simple/price`;
    return await this.queryCoingeckoApi(url, queryParams);
  }

  private async queryCoingeckoApi(url, queryParams): Promise<any> {
    logger.debug(`call coingecko api url=${url}`);
    const response = await axios.get(url, {
      params: queryParams,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    // logger.debug(`call coingecko api data=${JSON.stringify(response.data)}`);
    return response.data;
  }
}

export default TokensService;
