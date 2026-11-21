
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  Equals,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can contain only letters, numbers, _ and -',
  })
  username: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, {
    message: 'Password must contain uppercase, lowercase letters and a digit',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;

  @Equals(true, {
    message: 'You must accept the Terms of Service and Privacy Policy',
  })
  acceptedTerms: boolean;
}
