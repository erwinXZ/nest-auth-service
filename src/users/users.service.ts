import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createCipheriv, createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = this.hashPassword(createUserDto.password);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async updateLastLogin(userId: number) {
    await this.usersRepository.update(userId, { lastLogin: new Date() });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.findById(id);
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log("🚀 ~ UsersService ~ remove ~ user:", user)
    await this.usersRepository.remove(user);
  }

  hashPassword(password: string): string {
    const key = createHash('sha256')
      .update(String(this.configService.get<string>('JWT_SECRET')))
      .digest();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(password, 'utf8'),
      cipher.final(),
    ]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
