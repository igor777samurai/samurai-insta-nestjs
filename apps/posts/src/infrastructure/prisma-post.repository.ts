import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.ts';

@Injectable()
class PrismaPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    authorId: number;
    caption?: string;
    imageUrl?: string;
  }) {
    return this.prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    data: {
      caption?: string | null;
      imageUrl?: string | null;
    },
  ) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}

export default PrismaPostRepository
