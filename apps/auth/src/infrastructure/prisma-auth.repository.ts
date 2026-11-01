import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.ts';

export interface CreateAuthUserData {
  name: string;
  email: string;
  passwordHash: string;
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
      },
    });
  }
}
