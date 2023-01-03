import { Request } from 'express';
import { User } from '@prisma/client';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface RefreshTokenData {
  refreshToken: string;
  expiresIn: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
