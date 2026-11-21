export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
}

export class RegisterUserCommand {
  constructor(public readonly data: RegisterUserData) {}
}