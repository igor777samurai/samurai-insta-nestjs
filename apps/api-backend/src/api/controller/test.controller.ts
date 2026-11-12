import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  test() {

    console.log('[TEST] api-backend work!!!');
    return {
      status: 'ok',
      message: 'API Backend is working!',
    };
  }
}