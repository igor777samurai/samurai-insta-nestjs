import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import PrismaPostRepository from '../../infrastructure/prisma-post.repository.ts';
import { CreatePostCommand } from './create-post.command.ts';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postRepository: PrismaPostRepository) {}

  async execute(command: CreatePostCommand) {
    try {
      return await this.postRepository.create(command.data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new RpcException({
          statusCode: 400,
          message: 'Author does not exist',
        });
      }

      throw error;
    }
  }
}
