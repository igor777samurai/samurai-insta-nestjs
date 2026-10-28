import { UpdateUserDto } from '../../api/dto/update-user.dto.ts';

export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly data: UpdateUserDto,
  ) {}
}
