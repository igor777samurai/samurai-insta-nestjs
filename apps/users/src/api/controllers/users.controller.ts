import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FindAllUsersQuery } from '../../application/queries/find-all-users.query.ts';
import { FindUserByIdQuery } from '../../application/queries/find-user-by-id.query.ts';
import { CreateUserCommand } from '../../application/commands/create-user.command.ts';
import { UpdateUserCommand } from '../../application/commands/update-user.command.ts';
import { DeleteUserCommand } from '../../application/commands/delete-user.command.ts';

import { CreateUserDto } from '../dto/create-user.dto.ts';
import { UpdateUserDto } from '../dto/update-user.dto.ts';

@Controller()
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'users.findAll' })
  findAll() {
    return this.queryBus.execute(new FindAllUsersQuery());
  }

  @MessagePattern({ cmd: 'users.findOne' })
  findOne(@Payload() payload: { id: number }) {
    return this.queryBus.execute(new FindUserByIdQuery(payload.id));
  }

  @MessagePattern({ cmd: 'users.create' })
  create(@Payload() dto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @MessagePattern({ cmd: 'users.update' })
  update(@Payload() payload: { id: number; data: UpdateUserDto }) {
    return this.commandBus.execute(
      new UpdateUserCommand(payload.id, payload.data),
    );
  }

  @MessagePattern({ cmd: 'users.delete' })
  remove(@Payload() payload: { id: number }) {
    return this.commandBus.execute(new DeleteUserCommand(payload.id));
  }
}
