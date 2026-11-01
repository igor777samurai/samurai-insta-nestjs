import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(
    @Body() dto: { name: string; email: string; password: string },
  ) {
    return firstValueFrom(this.authClient.send({ cmd: 'auth.register' }, dto));
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return firstValueFrom(this.authClient.send({ cmd: 'auth.login' }, dto));
  }
}
