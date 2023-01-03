import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import { prisma } from '../../prisma';

const users = prisma.user;

const adminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.user.isAdmin) {
      next();
    } else {
      next(new HttpException(401, 'User does not have admin rights'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default adminMiddleware;
