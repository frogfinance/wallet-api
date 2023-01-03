import { transactionsServiceSingleton } from '@/services';
import { NextFunction, Request, Response } from 'express';

class TransactionsController {
  public transactionsService = transactionsServiceSingleton;

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const transaction = await this.transactionsService.create(req.body);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const gasEstimate = await this.transactionsService.estimateGas(req.body);
      const data = { ...transaction, gasEstimate };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data, message: 'transaction created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const transaction = await this.transactionsService.update(req.body);
      const data = { ...transaction };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data, message: 'transaction created' });
    } catch (error) {
      next(error);
    }
  };

  public getByHash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const transaction = await this.transactionsService.update(req.body);
      const data = { ...transaction };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data, message: 'transaction created' });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionsController;
