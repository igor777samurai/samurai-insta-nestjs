import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiBackendController {
  @Get('test')
  getTest() {
    return {
      message: 'Gateway is working!1',
      service: 'gateway',
      status: 'OK',
    };
  }
}