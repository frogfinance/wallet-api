// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from 'supertest';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from '@/app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UserRoute from '@routes/users.route';
import { createAdminAccount, createTestUser, createTestUsers, getAuthHeaderTokenForUser } from '../utils';
import { authServiceSingleton, userServiceSingleton } from '../../services';
import { faker } from '@faker-js/faker';

const userService = userServiceSingleton;
const authService = authServiceSingleton;

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Integration Testing Users - return users from database', () => {
  describe('[GET] /users', () => {
    it('response should return 401 for non-admin user requesting data [INT]', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const u = await createTestUser(userService, null);
      const token = await getAuthHeaderTokenForUser(authService, u.id);
      return request(app.getServer()).get(`${usersRoute.path}`).set('Authorization', token).expect(401);
    });

    it('response findAll users [INT]', async () => {
      const usersRoute = new UserRoute();
      let userCount = 5;
      await createTestUsers(userService, userCount);
      const { user, jwt } = await createAdminAccount();
      userCount++;

      const app = new App([usersRoute]);
      const r = await request(app.getServer()).get(`${usersRoute.path}`).set('Authorization', jwt);
      expect(r.status).toBe(200);
      expect(r.headers['content-type']).toMatch(/json/);
      expect(r.body.data.length).toEqual(userCount);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response should return 401 for non-admin user requesting data [INT]', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const u = await createTestUser(userService, null);
      const token = await getAuthHeaderTokenForUser(authService, u.id);
      return request(app.getServer()).get(`${usersRoute.path}/${u.id}`).set('Authorization', token).expect(401);
    });

    it('response findOne user [INT]', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const u = await createTestUser(userService, null);

      const { user, jwt } = await createAdminAccount();
      return request(app.getServer()).get(`${usersRoute.path}/${u.id}`).set('Authorization', jwt).expect(200);
    });
  });

  describe('[GET] /users/:email', () => {
    it('response should return 401 for non-admin user requesting data [INT]', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const u = await createTestUser(userService, null);
      const token = await getAuthHeaderTokenForUser(authService, u.id);
      return request(app.getServer()).get(`${usersRoute.path}/${u.email}`).set('Authorization', token).expect(401);
    });

    it('response findOne user by email [INT]', async () => {
      const u = await createTestUser(userService, null);
      console.log(u);
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const { user, jwt } = await createAdminAccount();
      return request(app.getServer()).get(`${usersRoute.path}/${u.email}`).set('Authorization', jwt).expect(200);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update user [INT]', async () => {
      const u = await createTestUser(userService, null);

      const payload: UpdateUserDto = {
        name: faker.name.fullName(),
        avatar: faker.image.avatar(),
        password: null,
        preferences: {
          notifications: true,
        },
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const authHeaderToken = await getAuthHeaderTokenForUser(authService, 1);
      return request(app.getServer()).put(`${usersRoute.path}/${u.id}`).send(payload).set('Authorization', authHeaderToken).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response should return 401 for non-admin user requesting data [INT]', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const u = await createTestUser(userService, null);
      const token = await getAuthHeaderTokenForUser(authService, u.id);
      return request(app.getServer()).delete(`${usersRoute.path}/${u.id}`).set('Authorization', token).expect(401);
    });

    it('response Delete user [INT]', async () => {
      const u = await createTestUser(userService, null);
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const { user, jwt } = await createAdminAccount();
      return request(app.getServer()).delete(`${usersRoute.path}/${u.id}`).set('Authorization', jwt).expect(200);
    });
  });

  describe('[GET] /users/me', () => {
    it('response user data by auth token [INT]', async () => {
      const u = await createTestUser(userService, null);
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const token = await getAuthHeaderTokenForUser(authService, u.id);
      const response = await request(app.getServer()).get(`${usersRoute.path}/me`).set('Authorization', token);
      expect(response.status).toEqual(200);
      expect(response.body.data.Wallets).toBeDefined();
      expect(response.body.data.UserClaims).toBeDefined();
      expect(response.body.data.UserTokenBalances).toBeDefined();
      expect(response.body.data.UserTrades).toBeDefined();
    });
  });
});
