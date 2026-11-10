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

  @Get('ping')
  async ping() {
    console.log('[API-GATEWAY] Sending ping to Auth');

    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'auth.ping' }, {}),
      );

      console.log('[API-GATEWAY] Auth response:', result);

      return result;
    } catch (error) {
      console.error('[API-GATEWAY] Auth ping failed:', error);
      throw error;
    }
  }
}
