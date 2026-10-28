export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export class CreateUserCommand {
  constructor(public readonly data: CreateUserData) {}
}
