import { Controller, Request } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: { username: string; password: string }) {
    return this.authService.login(data.username, data.password);
  }
}
