import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createDecipheriv, createHash } from 'crypto';
import { Token } from 'src/token/entities/token.entity';
import { User } from 'src/users/entities/user.entity';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && this.verifyPassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    const [ivHex, encryptedHex] = hashedPassword.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const key = createHash('sha256')
      .update(String(this.configService.get<string>('JWT_SECRET')))
      .digest();
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString() === password;
  }

  async login(username: string, password: string) {
    console.log("🚀 ~ AuthService ~ login ~ password:", password)
    console.log("🚀 ~ AuthService ~ login ~ username:", username)
    console.log("🚀 ~ AuthService ~ login ~ this.validateUser(username, password):", this.validateUser(username, password))
    if (await this.validateUser(username, password)) {
      const user = await this.usersService.findOneByUsername(username);
      const refreshToken = await this.createToken(user, 'refresh');
      const accessToken = await this.createToken(user, 'access');

      await this.usersService.updateLastLogin(user.id);

      return {
        id: user.id,
        username: user.username,
        access_token: accessToken.token,
        refresh_token: refreshToken.token,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async createToken(user: User, type: string): Promise<Token> {
    const payload = { username: user.username, sub: user.id };
    const expiresIn =
      type == 'refresh'
        ? this.configService.get<string>('JWT_REFRESH_EXPIRATION')
        : this.configService.get<string>('JWT_EXPIRATION');

    const token = this.jwtService.sign(payload, {
      expiresIn,
    });

    return await this.saveToken(user, token, type);
  }

  async saveToken(user: User, token: string, type: string): Promise<Token> {
    const refreshToken = new Token();
    refreshToken.user = user;
    refreshToken.type = type;
    refreshToken.token = token;

    return this.tokenService.addTokenToWhitelist(refreshToken);
  }
}
