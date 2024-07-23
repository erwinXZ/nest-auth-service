import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async addTokenToWhitelist(newToken): Promise<Token> {
    return this.tokenRepository.save(newToken);
  }

  async isValidToken(token: string): Promise<boolean> {
    const result = await this.tokenRepository.findOne({ where: { token } });
    return !!result;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.tokenRepository.delete({ token, type: 'refresh' });
  }

  async invalidateUserTokens(user: User): Promise<void> {
    await this.tokenRepository.delete({ user });
  }
}
