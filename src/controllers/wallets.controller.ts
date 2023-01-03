import { NextFunction, Request, Response } from 'express';
import { Wallet } from '@prisma/client';
import { walletsServiceSingleton } from '@/services';
import { CreateWalletDto, UpdateWalletDto } from '@dtos/wallets.dto';
import { HttpException } from '@exceptions/HttpException';
import { cleanWallet } from '@services/wallets.service';
import { RequestWithUser } from '@interfaces/auth.interface';

class WalletsController {
  public walletService = walletsServiceSingleton;

  public get = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const wallets = await this.walletService.wallet.findMany({
        select: {
          address: true,
          name: true,
        },
        where: { userId },
      });
      res.status(200).json({ data: wallets, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqData: CreateWalletDto = req.body;
      const createWalletData: Wallet = await this.walletService.create(reqData);
      const data: cleanWallet = {
        ...createWalletData,
      };
      res.status(201).json({ data, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletId = Number(req.params.id);
      const walletDto: UpdateWalletDto = req.body;
      // check pin
      const isValidPin = await this.walletService.pinCheck(walletId, walletDto.pin);
      if (!isValidPin) throw new HttpException(409, `Invalid pin`);
      const updateWalletData: Wallet = await this.walletService.update(walletId, walletDto);
      const data: cleanWallet = {
        ...updateWalletData,
      };
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default WalletsController;
