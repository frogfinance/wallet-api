import { prisma } from '../../prisma';
import { TransactionData, TxState } from '@prisma/client';
import { CreateTransactionDto, UpdateTransactionDto } from '@dtos/transactions.dto';
import { submitTransaction, transactionGasEstimate } from '@utils/ethereum.util';
import { BigNumber } from 'ethers';
import { walletsServiceSingleton } from '@services/index';

export interface cleanWallet {
  userId: number;
  address: string;
  blockchainId: number;
}

class TransactionsService {
  public transaction = prisma.transactionData;
  private wallet = prisma.wallet;
  private walletSalt = prisma.walletSalt;
  private walletsService = walletsServiceSingleton;

  public async create(createTransactionData: CreateTransactionDto): Promise<TransactionData> {
    const data = {
      ...createTransactionData,
      rawData: createTransactionData.tx,
      txState: TxState.PENDING,
    };
    return await this.transaction.create({ data });
  }

  public async update(updateTransactionDto: UpdateTransactionDto): Promise<TransactionData> {
    const transaction = await this.transaction.findUnique({ where: { id: updateTransactionDto.txId } });
    const data = {
      ...updateTransactionDto,
      rawData: updateTransactionDto.tx,
    };
    const key = await this.walletsService.decryptKey({ walletId: transaction.walletId, pin: updateTransactionDto.pin });
    const transactionResponse = await submitTransaction({ ...updateTransactionDto, key });
    data['hash'] = transactionResponse.hash;
    data['txState'] = TxState.PENDING;
    return await this.transaction.update({ where: { id: updateTransactionDto.txId }, data });
  }

  public async estimateGas(createTransactionDto: CreateTransactionDto): Promise<BigNumber> {
    const key = await this.walletsService.decryptKey({ ...createTransactionDto });
    return await transactionGasEstimate({ tx: createTransactionDto.tx, key });
  }
}

export default TransactionsService;
