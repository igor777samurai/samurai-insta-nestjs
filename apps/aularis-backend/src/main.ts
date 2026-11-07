import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5978;

  await app.listen(port, '0.0.0.0');
  console.log('TEST_ENV: ' + process.env.TEST_ENV);
}
await bootstrap();
