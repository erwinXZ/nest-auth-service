import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_user' })
  async findOne(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<User | undefined> {
    return this.usersService.findById(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(@Payload() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async remove(@Payload('id', ParseIntPipe) id: number): Promise<any> {
    await this.usersService.remove(id);
    return {};
  }
}
