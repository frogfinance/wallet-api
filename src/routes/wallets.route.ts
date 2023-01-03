import { Router } from 'express';
import WalletsController from '@controllers/wallets.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateWalletDto, UpdateWalletDto } from '@dtos/wallets.dto';
import authMiddleware from '@middlewares/auth.middleware';

class WalletsRoute implements Routes {
  public path = '/wallets';
  public router = Router();
  public walletsController = new WalletsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.walletsController.get);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateWalletDto, 'body'), this.walletsController.create);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(UpdateWalletDto, 'body', true), this.walletsController.update);
  }
}

export default WalletsRoute;
