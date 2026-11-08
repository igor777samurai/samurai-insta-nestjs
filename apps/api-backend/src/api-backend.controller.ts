import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiBackendController {
  @Get('test')
  getTest() {
    return {
      message: 'Gateway is working!',
      service: 'gateway',
      status: 'OK',
    };
  }
}