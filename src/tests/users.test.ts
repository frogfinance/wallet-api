// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from 'supertest';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from '@/app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CreateUserDto } from '@dtos/users.dto';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UserRoute from '@routes/users.route';
import { faker } from '@faker-js/faker';
import { getAuthHeaderTokenForUser } from './utils';
import { authServiceSingleton } from '../services';

const authService = authServiceSingleton;

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      users.findMany = jest.fn().mockReturnValue([
        {
          id: 1,
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          id: 2,
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          id: 3,
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      const app = new App([usersRoute]);
      const authHeaderToken = await getAuthHeaderTokenForUser(authService, 1);
      return request(app.getServer()).get(`${usersRoute.path}`).set('Authorization', authHeaderToken).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;
      const id = 1;
      users.findUnique = jest.fn().mockReturnValue({
        id,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(403);
      const authHeaderToken = await getAuthHeaderTokenForUser(authService, id);
      request(app.getServer()).get(`${usersRoute.path}/${userId}`).set('Authorization', authHeaderToken).expect(200);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1;
      const userData = {
        name: faker.name.fullName(),
      };

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      users.findUnique = jest.fn().mockReturnValue({
        id: userId,
        email: faker.internet.email(),
      });
      users.update = jest.fn().mockReturnValue({
        id: userId,
        name: userData.name,
      });

      const app = new App([usersRoute]);
      const authHeaderToken = await getAuthHeaderTokenForUser(authService, 1);
      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).set('Authorization', authHeaderToken).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1;
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      users.findUnique = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });
      users.delete = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([usersRoute]);
      const authHeaderToken = await getAuthHeaderTokenForUser(authService, 1);
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).set('Authorization', authHeaderToken).expect(200);
    });
  });
});
