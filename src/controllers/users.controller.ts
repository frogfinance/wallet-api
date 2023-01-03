import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { userServiceSingleton } from '@/services';
import UserService, { CleansedUser } from '@services/users.service';
import { RequestWithUser } from '@interfaces/auth.interface';

class UsersController {
  public userService: UserService = userServiceSingleton;

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: CleansedUser[] = await this.userService.findAllUser();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = Number(req.params.id);
      const findOneUserData: CleansedUser = await this.userService.findUserById(userId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getMyAccount = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = req.user.id;
      const userData: User = await this.userService.getAccount(userId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const account: Account = { ...userData };
      res.status(200).json({ data: account, message: 'ok' });
    } catch (error) {
      next(error);
    }
  };

  public getUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let { email } = req.params;
      email = email.toLowerCase();
      const findOneUserData: CleansedUser = await this.userService.findUserByObject({
        email,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);
      // const userWallet: Wallet = await this.walletService.create(createUserData);
      const cleanUser: CleansedUser = {
        ...createUserData,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(201).json({ data: cleanUser, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = Number(req.params.id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userData: UpdateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      const cleanUser: CleansedUser = {
        ...updateUserData,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: cleanUser, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);
      const cleanUser: CleansedUser = {
        ...deleteUserData,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: cleanUser, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
