import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma.service';

export interface CreateAuthUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface CreateRefreshTokenData {
  tokenHash: string;
  expiresAt: Date;
  userId: number;
}

export interface CreateEmailVerificationTokenData {
  tokenHash: string;
  expiresAt: Date;
  userId: number;
}

export interface CreatePasswordResetTokenData {
  tokenHash: string;
  expiresAt: Date;
  userId: number;
}

@Injectable()
export class PrismaAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateAuthUserData) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isEmailVerified: true,
      },
    });
  }

  async createRefreshToken(data: CreateRefreshTokenData) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  }

  async revokeRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async createEmailVerificationToken(
    data: CreateEmailVerificationTokenData,
  ) {
    return this.prisma.emailVerificationToken.create({
      data,
    });
  }

  async findEmailVerificationTokenByHash(tokenHash: string) {
    return this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
  }

  async markEmailVerificationTokenAsUsed(tokenHash: string) {
    return this.prisma.emailVerificationToken.updateMany({
      where: {
        tokenHash,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async verifyUserEmail(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
      },
    });
  }

  async createUserWithEmailVerificationToken(
    userData: CreateAuthUserData,
    tokenData: Omit<CreateEmailVerificationTokenData, 'userId'>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          isEmailVerified: true,
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          ...tokenData,
          userId: user.id,
        },
      });

      return user;
    });
  }

  async resetDatabase(): Promise<void> {
    await this.prisma.$executeRaw`
    TRUNCATE TABLE
      "posts",
      "refresh_tokens",
      "password_reset_tokens",
      "email_verification_tokens",
      "oauth_accounts",
      "devices",
      "users"
    RESTART IDENTITY CASCADE;
  `;
  }


  async createPasswordResetToken(data: CreatePasswordResetTokenData) {
    return this.prisma.passwordResetToken.create({
      data,
    });
  }

  async resetPasswordWithToken(
    tokenHash: string,
    newPasswordHash: string,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const token = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (
        !token ||
        token.usedAt ||
        token.expiresAt <= new Date()
      ) {
        return false;
      }

      // Помечаем токен использованным. updateMany защищает
      // от повторного использования при параллельных запросах.
      const consumed = await tx.passwordResetToken.updateMany({
        where: {
          id: token.id,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: {
          usedAt: new Date(),
        },
      });

      if (consumed.count === 0) {
        return false;
      }

      await tx.user.update({
        where: { id: token.userId },
        data: { passwordHash: newPasswordHash },
      });

      // Отзываем все активные refresh-токены пользователя.
      await tx.refreshToken.updateMany({
        where: {
          userId: token.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      // Остальные неиспользованные ссылки тоже становятся недействительными.
      await tx.passwordResetToken.updateMany({
        where: {
          userId: token.userId,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      return true;
    });
  }
}
