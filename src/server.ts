import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import TokensRoute from '@routes/tokens.route';
import TransactionsRoute from '@routes/transactions.route';
import WalletsRoute from '@routes/wallets.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new TokensRoute(), new TransactionsRoute(), new WalletsRoute()]);

app.listen();
