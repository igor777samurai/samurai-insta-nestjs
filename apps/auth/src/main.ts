import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { NodemailerService } from './infrastructure/email/nodemailer.service';

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

  const nodemailerService = app.get(NodemailerService);
  await nodemailerService.verifyConnection();

  await app.listen();

  console.log(`Auth Microservice is running on PORT: ${port}`);
  console.log(`SERVICE: ${process.env.SERVICE}`);

  // ENV MASKING
  const maskSecret = (value?: string): string => {
    if (!value) return 'не задан';
    if (value.length <= 6) return '*'.repeat(value.length);

    return `${value.slice(0, 3)}${'*'.repeat(8)}`;
  };

  // SERVICE
  console.log(`SERVICE: ${process.env.SERVICE}`);
  console.log(`TEST_ENV: ${process.env.TEST_ENV}`);

  // AUTH SERVICE
  console.log(`AUTH_SERVICE_HOST: ${process.env.AUTH_SERVICE_HOST}`);
  console.log(`AUTH_SERVICE_PORT: ${process.env.AUTH_SERVICE_PORT}`);

  // JWT
  console.log(`JWT_ACCESS_SECRET: ${maskSecret(process.env.JWT_ACCESS_SECRET)}`);
  console.log(`JWT_REFRESH_SECRET: ${maskSecret(process.env.JWT_REFRESH_SECRET)}`);

  // EMAIL / SMTP
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`SMTP_PASSWORD: ${maskSecret(process.env.SMTP_PASSWORD)}`);
  console.log(`SMTP_FROM: ${process.env.SMTP_FROM}`);

  // API
  console.log(`API_URL: ${process.env.API_URL}`);
  console.log(`PASSWORD_RESET_URL: ${process.env.PASSWORD_RESET_URL}`);

  // NEON
  const maskDatabaseUrl = (value?: string): string => {
    if (!value) return 'не задан';

    try {
      const url = new URL(value);
      if (url.password) url.password = maskSecret(url.password);
      return url.toString();
    } catch {
      return 'неверный формат URL';
    }
  };

  console.log(`DATABASE_URL: ${maskDatabaseUrl(process.env.DATABASE_URL)}`);
  console.log(`DIRECT_URL: ${maskDatabaseUrl(process.env.DIRECT_URL)}`);

}

void bootstrap();