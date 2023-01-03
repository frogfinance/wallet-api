import { NextFunction, Request, Response } from 'express';
import { tokensServiceSingleton } from '@/services';
import TokensService from '@services/tokens.service';

interface TokenParams {
  tokens: string;
}

class TokensController {
  public tokensService: TokensService = tokensServiceSingleton;

  public getTokenTickers = async (req: Request<{}, {}, {}, TokenParams>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query } = req;

      const data = await this.tokensService.getTokenTickers(query.tokens);
      res.status(200).json({ data, message: 'OK' });
    } catch (e) {
      next(e);
    }
  };

  public getTokenPrices = async (req: Request<{}, {}, {}, TokenParams>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query } = req;

      const data = await this.tokensService.getTokenPrices(query.tokens);
      res.status(200).json({ data, message: 'OK' });
    } catch (e) {
      next(e);
    }
  };
}

export default TokensController;
