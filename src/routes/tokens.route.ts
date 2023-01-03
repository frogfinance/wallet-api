import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import TokensController from '@controllers/tokens.controller';

class TokensRoute implements Routes {
  public path = '/token';
  public router = Router();
  public controller = new TokensController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/tickers`, this.controller.getTokenTickers);
    this.router.get(`${this.path}/prices`, this.controller.getTokenPrices);
  }
}

export default TokensRoute;
