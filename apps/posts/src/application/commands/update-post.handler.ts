import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import { PrismaPostRepository } from '../../infrastructure/prisma-post.repository.ts';
import { UpdatePostCommand } from './update-post.command.ts';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postRepository: PrismaPostRepository) {}

  async execute(command: UpdatePostCommand) {
    try {
      return await this.postRepository.update(command.id, command.data);
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
