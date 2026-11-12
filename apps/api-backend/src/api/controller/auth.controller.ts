import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RegisterDto } from '../dto/register.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description: 'Creates a new user account.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data',
  })
  @ApiConflictResponse({
    description: 'Email already registered',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async register(@Body() dto: RegisterDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'auth.register' }, dto),
    );
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and issues JWT tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Successfully authenticated',
    type: LoginResponseDto,
    headers: {
      'Set-Cookie': {
        description:
          'Refresh token cookie. HttpOnly, Secure, expires after 604800 seconds.',
        schema: {
          type: 'string',
          example:
            'refreshToken=JWT_TOKEN; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async login(@Body() dto: LoginDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'auth.login' }, dto),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Auth service health check' })
  @ApiOkResponse({ description: 'Auth controller is working' })
  test() {
    console.log('[API-AUTH] Simple GET reached');

    return {
      status: 'ok',
      message: 'AuthController is working!',
    };
  }

  @Get('ping')
  @ApiOperation({ summary: 'Auth ping' })
  @ApiOkResponse({ description: 'Ping route is working' })
  async ping() {
    console.log('[API-AUTH] Ping method entered');

    return {
      status: 'ok',
      message: 'Auth ping route is working!',
    };
  }
}