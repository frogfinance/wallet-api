import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import adminMiddleware from '@middlewares/admin.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, adminMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/me`, authMiddleware, this.usersController.getMyAccount);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, adminMiddleware, this.usersController.getUserById);
    this.router.get(`${this.path}/:email`, authMiddleware, adminMiddleware, this.usersController.getUserByEmail);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(UpdateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, adminMiddleware, this.usersController.deleteUser);
  }
}

export default UsersRoute;
