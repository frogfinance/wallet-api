import { CreateUserDto } from '../../dtos/users.dto';
import { User } from '@prisma/client';
import UserService from '../../services/users.service';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bcrypt from 'bcrypt';
import { prisma } from '../../../prisma';
import { TokenData } from '../../interfaces/auth.interface';
import AuthService from '../../services/auth.service';
import { authServiceSingleton, userServiceSingleton } from '../../services';

const authService = authServiceSingleton;
const localUserService = userServiceSingleton;

export async function seedTestData() {
  const BLOCKCHAINS = [
    { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
    { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
  ];
  const bcs = BLOCKCHAINS.map(async b => {
    const data = {
      name: b.name,
    };
    const bc = await prisma.blockchain.create({ data });
    const tokenData = {
      name: b.name,
      symbol: b.symbol,
      blockchainId: bc.id,
      isNative: true,
      decimals: b.decimals,
    };
    const token = await prisma.token.create({ data: tokenData });
    await prisma.blockchain.update({
      where: {
        id: bc.id,
      },
      data: {
        tokenId: token.id,
      },
    });
    return { bc, token };
  });
}

export async function seedTestDatabaseUser(userService: UserService, email: string, password: string): Promise<User> {
  const userData: CreateUserDto = {
    email,
    password,
  };
  const createUserData: User = await userService.createUser(userData);
  return createUserData;
}

interface createTestUserData {
  email: string;
  password: string;
}

export interface UserAndJwt {
  user: User;
  jwt: string;
}

export async function createTestUser(userService: UserService, data: createTestUserData): Promise<User> {
  return await seedTestDatabaseUser(
    userService,
    data ? data.email : faker.internet.email().toLowerCase(),
    data ? data.password : faker.internet.password(16),
  );
}

export async function generateUserAndJwt(): Promise<UserAndJwt> {
  const data = {
    password: faker.internet.password(16),
    email: faker.internet.email(faker.name.firstName(), faker.name.lastName()),
  };
  const user = await createTestUser(localUserService, data);
  const { token } = await authService.createTokenForUserId(user.id);
  return { user, jwt: `Bearer ${token}` };
}

export async function createAdminAccount(): Promise<UserAndJwt> {
  const { user, jwt } = await generateUserAndJwt();
  await localUserService.users.update({ where: { id: user.id }, data: { isAdmin: true } });
  return { user, jwt };
}

export async function createTestUsers(userService: UserService, count: number) {
  for (let i = 0; i < count; i++) {
    await createTestUser(userService, null);
  }
}

export async function getAuthHeaderTokenForUser(authService: AuthService, id: number): Promise<string> {
  const t = await authService.createTokenForUserId(id);
  return `Bearer ${t.token}`;
}
