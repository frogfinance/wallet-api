import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import TransactionsController from '@controllers/transactions.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateTransactionDto, UpdateTransactionDto } from '@dtos/transactions.dto';

class TransactionsRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public transactionsController = new TransactionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:hash`, this.transactionsController.getByHash);
    this.router.post(`${this.path}`, validationMiddleware(CreateTransactionDto, 'body'), this.transactionsController.create);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(UpdateTransactionDto, 'body', true), this.transactionsController.update);
  }
}

export default TransactionsRoute;
