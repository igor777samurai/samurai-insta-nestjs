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

  const maskSecret = (value?: string): string => {
    if (!value) return 'не задан';

    if (value.length <= 6) return '*'.repeat(value.length);

    return `${value.slice(0, 6)}${'*'.repeat(8)}`;
  };

  console.log(`JWT_ACCESS_SECRET: ${maskSecret(process.env.JWT_ACCESS_SECRET)}`);
  console.log(`JWT_REFRESH_SECRET: ${maskSecret(process.env.JWT_REFRESH_SECRET)}`);

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