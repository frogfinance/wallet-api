import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JWT_ALGORITHM, REFRESH_TOKEN_SECRET_KEY, SECRET_KEY } from '@config';
import { CreateUserDto, UserRefreshTokenDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RefreshTokenData, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import { userServiceSingleton } from '@services/index';

class AuthService {
  public userService = userServiceSingleton;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    return this.userService.createUser(userData);
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User; accessToken: string; refreshToken: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.userService.users.findUnique({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const accessToken = tokenData.token;
    const cookie = this.createCookie(tokenData);
    const { refreshToken } = this.createRefreshToken();

    return { cookie, findUser, accessToken, refreshToken };
  }

  public async refresh(userData: UserRefreshTokenDto): Promise<{ cookie: string; findUser: User; accessToken: string; refreshToken: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.userService.users.findUnique({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');
    try {
      const verificationResponse = await verify(userData.refreshToken, REFRESH_TOKEN_SECRET_KEY, { algorithms: ['ES384'] });
    } catch (e) {
      return Promise.reject(new HttpException(403, 'Refresh token not valid'));
    }

    const tokenData = this.createToken(findUser);
    const accessToken = tokenData.token;
    const cookie = this.createCookie(tokenData);
    const { refreshToken } = this.createRefreshToken();

    return { cookie, findUser, accessToken, refreshToken };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.userService.users.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: User): TokenData {
    return this.createTokenForUserId(user.id);
  }

  public createTokenForUserId(id: number): TokenData {
    const dataStoredInToken: DataStoredInToken = { id };
    const secretKey: string = SECRET_KEY;
    const expiresIn = '15s';
    const algorithm = JWT_ALGORITHM;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn, algorithm }) };
  }

  public createRefreshToken(): RefreshTokenData {
    const secretKey: string = REFRESH_TOKEN_SECRET_KEY;
    const expiresIn = `1 days`;
    const algorithm = JWT_ALGORITHM;

    return { expiresIn, refreshToken: sign({}, secretKey, { expiresIn, algorithm }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
