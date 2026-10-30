import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import PrismaPostRepository from '../../infrastructure/prisma-post.repository.ts';
import { DeletePostCommand } from './delete-post.command.ts';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postRepository: PrismaPostRepository) {}

  async execute(command: DeletePostCommand) {
    try {
      await this.postRepository.delete(command.id);

      return {
        success: true,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException({
          statusCode: 404,
          message: 'Post not found',
        });
      }

      throw error;
    }
  }
}
