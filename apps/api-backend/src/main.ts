import { NestFactory } from '@nestjs/core';
import { ApiBackendModule } from './api-backend.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(ApiBackendModule);

  app.setGlobalPrefix('api/v1');
  setupSwagger(app);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`API Backend is running on PORT: ${port}`);
  console.log(`SERVICE: ${process.env.SERVICE}`);

  console.log(`TEST_ENV: ${process.env.TEST_ENV}`);
  console.log(`AUTH_SERVICE_HOST: ${process.env.AUTH_SERVICE_HOST}`);
  console.log(`AUTH_SERVICE_PORT: ${process.env.AUTH_SERVICE_PORT}`);
}

void bootstrap();