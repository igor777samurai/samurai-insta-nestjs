import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import { CreatePostCommand } from './create-post.command.ts';
import { PrismaService } from '../../../../core/database/prisma.service.ts';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreatePostCommand) {
    const { authorId, caption, imageUrl } = command.data;

    try {
      return await this.prisma.post.create({
        data: {
          authorId,
          caption,
          imageUrl,
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new RpcException({
          statusCode: 400,
          message: 'User with this authorId does not exist',
        });
      }

      throw error;
    }
  }
}
