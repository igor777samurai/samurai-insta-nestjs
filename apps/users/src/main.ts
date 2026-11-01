import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module.ts';
import { createRpcValidationPipe } from '../../../core/common/pipes/validation.pipe.ts';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001,
      },
    },
  );

  app.useGlobalPipes(createRpcValidationPipe());

  await app.listen();

  console.log('Posts microservice is running on port 3001');
}

bootstrap();