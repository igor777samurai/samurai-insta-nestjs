import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('TCP_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @Get()
  async getHello() {
    return firstValueFrom(
      this.client.send<{ message: string }>({ cmd: 'hello' }, {}),
    );
  }
}
