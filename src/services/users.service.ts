import { hash } from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { v4 as uuidv4 } from 'uuid';
import * as speakeasy from 'speakeasy';
import { prisma } from '../../prisma';
import { logger } from '@utils/logger';

const saveUserFields = {
  id: true,
  uuid: true,
  email: true,
  name: true,
  avatar: true,
  preferences: true,
  isAdmin: true,
};

export interface CleansedUser {
  id: number;
  uuid: string;
  email: string;
  name: any;
  avatar: any;
  preferences: any;
  isAdmin: boolean;
}

export interface Account extends CleansedUser {
  wallets: any;
  balances: any;
}

class UserService {
  public users = prisma.user;

  public async findAllUser(): Promise<CleansedUser[]> {
    const allUser: CleansedUser[] = await this.users.findMany({ select: saveUserFields });
    return allUser;
  }

  public async findUserById(userId: number): Promise<CleansedUser> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: CleansedUser = await this.users.findUnique({ where: { id: userId }, select: saveUserFields });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async findUserByObject(fields: any): Promise<CleansedUser> {
    if (isEmpty(fields)) throw new HttpException(400, 'Fields is empty');

    const findUser: CleansedUser = await this.users.findFirst({ where: { ...fields }, select: saveUserFields });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findUnique({ where: { email: userData.email.toLowerCase() } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const speakeasySecret = speakeasy.generateSecret({ length: 16 });
    logger.debug(`speakeasy secret=${speakeasySecret}`);
    const defaultValues = {
      uuid: uuidv4().toString(),
      otp: `${speakeasySecret.base32}`,
      preferences: {},
    };
    const data = { ...defaultValues, ...userData, password: hashedPassword };
    return await this.users.create({ data });
  }

  public async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (userData.password && userData.password.length > 8) {
      userData.password = await hash(userData.password, 10);
    } else {
      userData.password = findUser.password;
    }
    const updateUserData = await this.users.update({ where: { id: userId }, data: { ...userData } });
    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't existId");

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return deleteUserData;
  }

  public async getAccount(userId: number): Promise<User> {
    return await this.users.findUnique({
      where: { id: userId },
      include: {
        Wallets: {
          select: {
            id: true,
            blockchainId: true,
            address: true,
            name: true,
          },
        },
        UserClaims: {
          select: {
            tokenId: true,
            isClaimed: true,
          },
        },
        UserTokenBalances: {
          select: {
            balance: true,
            tokenId: true,
            nftTokenIds: true,
          },
        },
        UserTrades: {
          select: {
            hash: true,
            tokenInId: true,
            tokenOutId: true,
            blockchainId: true,
            costBasis: true,
            tokenInUSDVal: true,
            tokenOutUSDVal: true,
            data: true,
          },
        },
        TransactionData: {
          select: {
            blockchainId: true,
            hash: true,
            txState: true,
          },
        },
        UserPin: {
          select: {
            resetAttempts: true,
            isLocked: true,
            updatedAt: true,
          },
        },
      },
    });
  }
}

export default UserService;
