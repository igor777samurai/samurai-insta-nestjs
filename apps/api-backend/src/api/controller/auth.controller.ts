
import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException, BadRequestException, Query, ForbiddenException,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiBearerAuth, ApiForbiddenResponse,
} from '@nestjs/swagger';

import {
  catchError,
  firstValueFrom,
  throwError,
} from 'rxjs';

import type {
  Request,
  Response as ExpressResponse,
} from 'express';

import { RegisterDto } from '../dto/register.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}


  // REGISTER
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User registration',
    description: 'Creates a new user and starts email verification.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: 'Registration created. Email verification is required.',
    schema: {
      example: {
        message: 'Registration created',
        email: 'alex@example.com',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data or passwords do not match',
  })
  @ApiConflictResponse({
    description: 'Email already registered',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async register(@Body() dto: RegisterDto) {
    const result = await firstValueFrom(
      this.authClient
        .send({ cmd: 'auth.register' }, dto)
        .pipe(
          catchError((error) => {
            if (error.statusCode === 409) {
              return throwError(
                () => new ConflictException(error.message),
              );
            }

            if (error.statusCode === 400) {
              return throwError(
                () => new BadRequestException(error.message),
              );
            }

            return throwError(
              () => new InternalServerErrorException(),
            );
          }),
        ),
    );

    return {
      message: 'Registration created',
      email: result.email,
    };
  }

  // LOGIN
  @Post('login')
  @HttpCode(HttpStatus.OK)
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
        description: 'HttpOnly refresh token cookie.',
        schema: {
          type: 'string',
          example:
            'refreshToken=JWT_TOKEN; HttpOnly; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800',
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
  @ApiForbiddenResponse({
    description: 'Email is not verified',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const result = await firstValueFrom(
      this.authClient
        .send({ cmd: 'auth.login' }, dto)
        .pipe(
          catchError((error) => {
            if (error.statusCode === 403) {
              return throwError(
                () =>
                  new ForbiddenException(
                    error.message || 'Please verify your email before logging in',
                  ),
              );
            }

            if (error.statusCode === 401) {
              return throwError(
                () =>
                  new UnauthorizedException(
                    error.message || 'Invalid email or password',
                  ),
              );
            }

            return throwError(
              () => new InternalServerErrorException(),
            );
          }),
        ),
    );

    const { accessToken, refreshToken } = result;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
    };
  }

  // LOGOUT
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'User logout',
    description:
      'Revokes refresh token and clears refresh token cookie.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiNoContentResponse({
    description: 'Successfully logged out.',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is missing or invalid.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is missing',
      );
    }

    await firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.logout' },
          { refreshToken },
        )
        .pipe(
          catchError((error) => {
            if (error.statusCode === 401) {
              return throwError(
                () =>
                  new UnauthorizedException(
                    error.message || 'Invalid refresh token',
                  ),
              );
            }

            return throwError(
              () => new InternalServerErrorException(),
            );
          }),
        ),
    );

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }

  // GET CURRENT USER
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current authenticated user',
    description:
      'Verifies access token through Auth microservice and returns current user profile.',
  })
  @ApiOkResponse({
    description: 'Current user profile',
    schema: {
      example: {
        id: 9,
        name: 'Alex',
        email: 'alex@example.com',
        createdAt: '2026-11-18T02:10:13.220Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Access token is missing or invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getMe(@Req() request: Request) {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Access token is missing',
      );
    }

    const accessToken = authHeader.slice(7);

    // 1. Verify access token through Auth microservice
    const payload = await firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.verify-access-token' },
          { accessToken },
        )
        .pipe(
          catchError(() =>
            throwError(
              () =>
                new UnauthorizedException(
                  'Invalid or expired access token',
                ),
            ),
          ),
        ),
    );

    // 2. Get fresh user profile through CQRS
    return firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.me' },
          { userId: payload.sub },
        )
        .pipe(
          catchError((error) => {
            if (error.statusCode === 404) {
              return throwError(
                () =>
                  new UnauthorizedException(
                    'User not found',
                  ),
              );
            }

            return throwError(
              () => new InternalServerErrorException(),
            );
          }),
        ),
    );
  }

  // HEALTH CHECK
  @Get()
  @ApiOperation({
    summary: 'Auth service health check',
  })
  @ApiOkResponse({
    description: 'Auth controller is working',
  })
  test() {
    console.log('[API-AUTH] Simple GET reached');

    return {
      status: 'ok',
      message: 'AuthController is working!',
    };
  }

  // PING
  @Get('ping')
  @ApiOperation({
    summary: 'Auth ping',
  })
  @ApiOkResponse({
    description: 'Ping route is working',
  })
  async ping() {
    console.log('[API-AUTH] Ping method entered');

    return {
      status: 'ok',
      message: 'Auth ping route is working!',
    };
  }


  // VERIFY EMAIL
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify user email',
    description: 'Confirms user email using the verification token.',
  })
  @ApiOkResponse({
    description: 'Email successfully verified.',
    schema: {
      example: {
        message: 'Email successfully verified',
        email: 'alex@example.com',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired verification token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const result = await firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.verify-email' },
          { token },
        )
        .pipe(
          catchError((error) => {
            if (error.statusCode === 400) {
              return throwError(
                () => new BadRequestException(error.message),
              );
            }

            return throwError(
              () => new InternalServerErrorException(),
            );
          }),
        ),
    );

    return {
      message: 'Email successfully verified',
      email: result.email,
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.forgot-password' },
          { email: dto.email },
        )
        .pipe(
          catchError((error) => {
            throw error;
          }),
        ),
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    return firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.reset-password' },
          {
            token: dto.token,
            newPassword: dto.newPassword,
          },
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(
              error.message || 'Password reset failed',
            );
          }),
        ),
    );
  }
}
