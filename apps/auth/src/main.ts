import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {

  const port = Number(process.env.PORT) || 4467;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4467,
      },
    },
  );

  await app.listen();

  console.log(`Auth Microservice is running on PORT: ${port}`);
  console.log(`SERVICE: ${process.env.SERVICE}`);

  console.log(`TEST_ENV: ${process.env.TEST_ENV}`);
  console.log(`AUTH_SERVICE_HOST: ${process.env.AUTH_SERVICE_HOST}`);
  console.log(`AUTH_SERVICE_PORT: ${process.env.AUTH_SERVICE_PORT}`);
}

void bootstrap();