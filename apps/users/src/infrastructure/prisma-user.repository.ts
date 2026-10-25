import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../../core/database/prisma.service.ts";

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; email: string; passwordHash: string }) {
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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}