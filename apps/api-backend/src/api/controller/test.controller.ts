import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  test() {

    console.log('[API-TEST] Auth response:');
    return {
      status: 'ok',
      message: 'API Backend is working!',
    };
  }
}