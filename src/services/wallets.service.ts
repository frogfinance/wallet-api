import { Wallet } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { prisma } from '../../prisma';
import { decrypt, encrypt, generateRandomKey } from '@utils/encryptionUtils';
import { compare, hash } from 'bcrypt';
import { CreateWalletDto, UpdateWalletDto } from '@dtos/wallets.dto';
import { generateEthWallet } from '@utils/ethereum.util';
import { logger } from '@utils/logger';

export interface cleanWallet {
  address: string;
  name: string;
}

class WalletsService {
  public wallet = prisma.wallet;
  public walletSalt = prisma.walletSalt;
  public userPin = prisma.userPin;
  public blockchain = prisma.blockchain;

  public async create(createWalletData: CreateWalletDto): Promise<Wallet> {
    const findWallet: Wallet = await this.wallet.findFirst({
      where: { userId: createWalletData.userId, blockchainId: createWalletData.blockchainId },
    });
    if (findWallet) throw new HttpException(409, `User ${createWalletData.userId} already has a wallet for this blockchain`);
    const walletCount: number = await this.wallet.count({
      where: { userId: createWalletData.userId },
    });
    if (walletCount && walletCount > 0) {
      const isValidPin = await this.pinCheck(createWalletData.userId, createWalletData.pin);
      if (!isValidPin) throw new HttpException(403, `Invalid pin!`);
    }
    let generatedWallet = null;
    const bc = await this.blockchain.findFirst({ where: { id: createWalletData.blockchainId } });
    if (!bc) throw new HttpException(409, `Bitcoin wallet not supported yet`);
    switch (bc.name) {
      case 'Ethereum':
        generatedWallet = generateEthWallet();
        break;
      case 'Bitcoin':
        throw new HttpException(409, `Bitcoin wallet not supported yet`);
        break;
      case 'Polygon':
        throw new HttpException(409, `Polygon wallet not supported yet`);
        break;
      default:
        throw new HttpException(409, `Blockchain wallet not supported yet`);
        break;
    }
    const salt = generateRandomKey(16);
    const keySalt = generateRandomKey(32);
    const encrypted = encrypt({ text: generatedWallet.privateKey, salt, keySalt, pin: createWalletData.pin });
    const hashedPin = await hash(createWalletData.pin, 10);
    const data = {
      address: generatedWallet.address,
      userId: createWalletData.userId,
      encrypted,
      name: bc.name,
      blockchainId: createWalletData.blockchainId,
    };
    const wallet = await this.wallet.create({ data });
    const walletId: number = +wallet.id;
    await this.walletSalt.create({ data: { walletId, salt: salt.toString('hex') } });
    if (walletCount === 0) {
      await this.userPin.create({ data: { userId: createWalletData.userId, pin: hashedPin } });
    }
    return wallet;
  }

  public async update(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const findWallet: Wallet = await this.wallet.findUnique({
      where: { id: id },
    });
    if (findWallet) throw new HttpException(409, `Wallet not found`);

    // update wallet encrypted value using the new pin
    const saltData = await this.walletSalt.findUnique({ where: { walletId: id } });
    const salt = saltData.salt;
    const keySalt = saltData.keySalt;
    // decrypt existing wallet
    const decrypted = decrypt({ hash: findWallet.encrypted, salt, keySalt, pin: updateWalletDto.pin });
    // encrypt the wallet with the new pin
    const encrypted = encrypt({ text: decrypted, salt, keySalt, pin: updateWalletDto.newPin });
    await this.wallet.update({ where: { id }, data: { encrypted } });

    const hashedPin = await hash(updateWalletDto.newPin, 10);
    await this.userPin.update({ where: { userId: findWallet.userId }, data: { pin: hashedPin } });
    logger.info('updatedUserWalletPin');
    return findWallet;
  }

  public async pinCheck(userId: number, pin: string): Promise<Boolean> {
    const userWalletPin = await this.userPin.findFirst({ where: { userId } });
    const isValid = await compare(pin, userWalletPin.pin);
    if (!isValid) {
      const updateData = {
        resetAttempts: userWalletPin.resetAttempts + 1,
        isLocked: false,
      };
      if (updateData.resetAttempts >= 3) {
        updateData.isLocked = true;
      }
      await this.userPin.update({ where: { id: userWalletPin.id }, data: updateData });
    } else if (userWalletPin.resetAttempts > 0 && !userWalletPin.isLocked) {
      const updateData = {
        resetAttempts: 0,
      };
      await this.userPin.update({ where: { id: userWalletPin.id }, data: updateData });
    }
    return isValid;
  }

  public async decryptKey({ walletId, pin }): Promise<string> {
    const w = await this.wallet.findUnique({ where: { id: walletId } });
    const saltDbObj = await this.walletSalt.findUnique({ where: { walletId } });
    const salt = Buffer.from(saltDbObj.salt, 'hex');
    const key = decrypt({ hash: w.encrypted, salt, keySalt: saltDbObj.keySalt, pin });
    return key;
  }
}

export default WalletsService;
