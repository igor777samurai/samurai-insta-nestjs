export interface LoginData {
  email: string;
  password: string;
}

export class LoginCommand {
  constructor(public readonly data: LoginData) {}
}
