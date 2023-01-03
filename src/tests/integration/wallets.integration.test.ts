import { userServiceSingleton } from '../../services';
import { CreateWalletDto } from '../../dtos/wallets.dto';
import { createTestUser, generateUserAndJwt, seedTestData } from '../utils';
import App from '../../app';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from 'supertest';
import WalletsRoute from '../../routes/wallets.route';
import { prisma } from '../../../prisma';

const userService = userServiceSingleton;

beforeAll(async () => {
  await seedTestData();
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Integration Testing Wallets - return wallet from db [INT]', () => {
  describe('[POST] /wallets', () => {
    it('response Create Ethereum wallet', async () => {
      const { user: u, jwt } = await generateUserAndJwt();
      const blockchain = await prisma.blockchain.findFirst({ where: { name: 'Ethereum' } });
      const id = blockchain ? blockchain.id : 0;
      const payload: CreateWalletDto = {
        pin: '123999',
        userId: u.id,
        blockchainId: id,
      };

      const walletsRoute = new WalletsRoute();
      const app = new App([walletsRoute]);
      const response = await request(app.getServer()).post(`${walletsRoute.path}/`).set('Authorization', jwt).send(payload);
      expect(response.status).toEqual(200);
      expect(response.body.data.address).toBeDefined();
    });

    it('respond with all user wallets', async () => {
      const { user: u, jwt } = await generateUserAndJwt();
      const headers = { Authorization: jwt };
      const blockchain = await prisma.blockchain.findFirst({ where: { name: 'Ethereum' } });
      const id = blockchain ? blockchain.id : 0;
      const payload: CreateWalletDto = {
        pin: '918219',
        userId: u.id,
        blockchainId: id,
      };

      const walletsRoute = new WalletsRoute();
      const app = new App([walletsRoute]);
      const createResponse = await request(app.getServer()).post(`${walletsRoute.path}/`).set('Authorization', jwt).send(payload);
      expect(createResponse.status).toEqual(201);
      const getWalletResponse = await request(app.getServer()).get(`${walletsRoute.path}/`).set('Authorization', jwt);
      expect(getWalletResponse.status).toEqual(200);
      expect(getWalletResponse.body.data).toBeDefined();
      expect(getWalletResponse.body.data[0].address).toBeDefined();
      expect(getWalletResponse.body.data[0].encyrpted).toBeUndefined();
    });
  });
});
