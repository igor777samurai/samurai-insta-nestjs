import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001, // Микросервис слушает порт 3001
      },
      instrument: ObserveInstrument,
    },
  );

  await app.listen();
  console.log(`Микросервис запущен и ожидает TCP-запросы на порту 3001`);
}
await bootstrap();
