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
        port: port,
      },
    },
  );

  await app.listen();

  console.log(`Auth Microservice is running on PORT: ${port}`);
  console.log(`SERVICE: ${process.env.SERVICE}`);

  // ENV
  console.log(`TEST_ENV: ${process.env.TEST_ENV}`);
  console.log(`AUTH_SERVICE_HOST: ${process.env.AUTH_SERVICE_HOST}`);
  console.log(`AUTH_SERVICE_PORT: ${process.env.AUTH_SERVICE_PORT}`);

  // NEON
  const databaseUrl = process.env.DATABASE_URL ?? '';
  const safeDatabaseUrl = (process.env.DATABASE_URL ?? '')
    .trim()
    .replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1********$2');
  console.log('DATABASE_URL:', safeDatabaseUrl);

  const directUrl = process.env.DIRECT_URL ?? '';
  const safeDirectUrl = directUrl
    .trim()
    .replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1********$2');
  console.log('DIRECT_URL:', safeDirectUrl);

}

void bootstrap();