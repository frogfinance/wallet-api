import UserService from '@services/users.service';
import AuthService from '@services/auth.service';
import WalletsService from '@services/wallets.service';
import TransactionsService from '@services/transactions.service';
import EthereumService from '@services/ethereum.service';
import TokensService from '@services/tokens.service';

export const userServiceSingleton = new UserService();
export const authServiceSingleton = new AuthService();
export const walletsServiceSingleton = new WalletsService();
export const transactionsServiceSingleton = new TransactionsService();
export const ethereumServiceSingleton = new EthereumService();
export const tokensServiceSingleton = new TokensService();
