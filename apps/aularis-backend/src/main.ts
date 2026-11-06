import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(process.env.port || 3000);
  console.log('API Gateway is running on port 3000');
  console.log('TEST_ENV: ' + process.env.TEST_ENV);
}
await bootstrap();
