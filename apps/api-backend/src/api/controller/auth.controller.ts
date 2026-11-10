import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
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

  @Get()
  test() {
    console.log('[API-AUTH] Simple GET reached');

    return {
      status: 'ok',
      message: 'AuthController is working!',
    };
  }

  // GET для проверки маршрута ping
  @Get('ping')
  async ping() {
    console.log('[API-AUTH] Ping method entered');

    return {
      status: 'ok',
      message: 'Auth ping route is working!',
    };
  }
}
