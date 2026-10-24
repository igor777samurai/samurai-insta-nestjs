import {RegisterUserDto} from "../../api/dto/register-user.dto.ts";

export class RegisterUserCommand {
  constructor(public readonly data: RegisterUserDto) {}
}