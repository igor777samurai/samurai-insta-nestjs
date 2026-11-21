
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { TokenHashService } from './token-hash.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly tokenHashService: TokenHashService,
  ) {}

  createTokenData() {
    const token = randomBytes(32).toString('hex');

    const tokenHash = this.tokenHashService.hash(token);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return {
      token,
      tokenData: {
        tokenHash,
        expiresAt,
      },
    };
  }
}
