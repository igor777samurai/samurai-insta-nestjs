import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export function createRpcValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );

      return new RpcException({
        statusCode: 400,
        message: messages,
      });
    },
  });
}
