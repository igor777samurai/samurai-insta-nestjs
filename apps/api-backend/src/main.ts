import { NestFactory } from '@nestjs/core';
import { ApiBackendModule } from './api-backend.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiBackendModule);

  app.setGlobalPrefix('api/v1');

  const port = Number(process.env.PORT) || 5978;

  await app.listen(port, '0.0.0.0');

  console.log(`API Backend is running on port ${port}`);
  console.log(`SERVICE: ${process.env.SERVICE}`);
  console.log(`AUTH_PORT: ${process.env.AUTH_PORT}`);
  console.log(`TEST_ENV: ${process.env.TEST_ENV}`);
}

void bootstrap();