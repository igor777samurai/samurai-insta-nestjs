import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3003
    }

  })

  await app.listen();
  console.log('Auth microservices is running on port 3003');
}
await bootstrap();
