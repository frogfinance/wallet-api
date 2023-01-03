import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto, UserRefreshTokenDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { authServiceSingleton } from '@/services';
import { CleansedUser } from '@services/users.service';

class AuthController {
  public authService = authServiceSingleton;
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      const user: CleansedUser = { ...signUpUserData };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(201).json({ data: { user }, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userData: CreateUserDto = req.body;
      const { cookie, findUser, accessToken, refreshToken } = await this.authService.login(userData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.setHeader('Set-Cookie', [cookie]);

      const user: CleansedUser = { ...findUser };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: { user, accessToken, refreshToken }, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);
      const user: CleansedUser = { ...logOutUserData };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: { user }, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const requestData: UserRefreshTokenDto = req.body;
      const { cookie, findUser, accessToken, refreshToken } = await this.authService.refresh({ ...requestData });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.setHeader('Set-Cookie', [cookie]);

      const user: CleansedUser = { ...findUser };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(200).json({ data: { user, accessToken, refreshToken }, message: 'refresh' });
    } catch (error) {}
  };
}

export default AuthController;
