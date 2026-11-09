import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';

import { LoginCommand } from '../../application/commands/login.command';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import {RegisterUserCommand} from "../../application/commands/register-user.command";

@Controller()
export class AuthMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'auth.ping' })
  ping() {
    return {
      status: 'ok',
      service: 'auth',
      message: 'Auth microservice is alive',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern({ cmd: 'auth.register' })
  register(@Payload() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterUserCommand({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      }),
    );
  }

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() dto: LoginDto) {
    return this.commandBus.execute(
      new LoginCommand({
        email: dto.email,
        password: dto.password,
      })
    );
  }
}