import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthMessageController {
  @MessagePattern('auth.ping')
  ping() {
    return {
      status: 'ok',
      service: 'auth',
      message: 'Auth microservice is working',
    };
  }
}