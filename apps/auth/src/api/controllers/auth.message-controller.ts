import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

import {RegisterUserCommand} from "../../application/commands/register-user.command";
import { LoginCommand } from '../../application/commands/login.command';
import { LogoutCommand } from '../../application/commands/logout.command';
import { GetMeQuery } from '../../application/queries/get-me.query';
import { JwtTokenService } from '../../infrastructure/security/jwt-token.service';
import { VerifyEmailCommand } from '../../application/commands/verify-email.command';
import { ResetDatabaseCommand } from '../../application/commands/reset-database.command';
import { ForgotPasswordCommand } from '../../application/commands/forgot-password.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password.command';


@Controller()
export class AuthMessageController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus,  private readonly jwtTokenService: JwtTokenService) {}

  @MessagePattern({ cmd: 'auth.ping' })
  ping() {
    console.log('[AUTH] Received auth.ping');

    const response = {
      status: 'ok',
      service: 'auth',
      message: 'Auth microservice is alive',
      timestamp: new Date().toISOString(),
    };

    console.log('[AUTH] Sending ping response:', response);

    return response;
  }

  @MessagePattern({ cmd: 'auth.register' })
  register(@Payload() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterUserCommand({
        username: dto.username,
        email: dto.email,
        password: dto.password,
        passwordConfirmation: dto.passwordConfirmation,
        acceptedTerms: dto.acceptedTerms,
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

  @MessagePattern({ cmd: 'auth.logout' })
  logout(@Payload() data: { refreshToken: string }) {
    return this.commandBus.execute(
      new LogoutCommand(data.refreshToken),
    );
  }

  @MessagePattern({ cmd: 'auth.verify-access-token' })
  async verifyAccessToken(
    @Payload() data: { accessToken: string },
  ) {
    return this.jwtTokenService.verifyAccessToken(data.accessToken);
  }

  @MessagePattern({ cmd: 'auth.me' })
  async getMe(@Payload() data: { userId: number }) {
    return this.queryBus.execute(
      new GetMeQuery(data.userId),
    );
  }

  @MessagePattern({ cmd: 'auth.verify-email' })
  async verifyEmail(@Payload() data: { token: string }) {
    return this.commandBus.execute(
      new VerifyEmailCommand(data.token),
    );
  }

  @MessagePattern({ cmd: 'database.reset' })
  async resetDatabase() {
    return this.commandBus.execute(new ResetDatabaseCommand());
  }

  @MessagePattern({ cmd: 'auth.forgot-password' })
  async forgotPassword(@Payload() data: { email: string }) {
    await this.commandBus.execute(
      new ForgotPasswordCommand(data.email),
    );

    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
    };
  }

  @MessagePattern({ cmd: 'auth.reset-password' })
  async resetPassword(
    @Payload() data: {
      token: string;
      newPassword: string;
    },
  ) {
    await this.commandBus.execute(
      new ResetPasswordCommand(data.token, data.newPassword),
    );

    return {
      message: 'Password has been reset successfully',
    };
  }
}