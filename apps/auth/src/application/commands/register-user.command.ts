export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserCommand {
  constructor(public readonly data: RegisterUserData) {}
}
