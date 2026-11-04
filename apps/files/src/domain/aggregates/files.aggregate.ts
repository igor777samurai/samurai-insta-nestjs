import { randomUUID } from 'crypto';

export class FileAggregate {
  private constructor(
    public readonly id: string,
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly userId: string,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    originalName: string;
    mimeType: string;
    size: number;
    userId: string;
  }): FileAggregate {
    if (params.size <= 0) {
      throw new Error('File cannot be empty');
    }

    if (params.size > 5 * 1024 * 1024) {
      throw new Error('File is too large');
    }

    return new FileAggregate(
      randomUUID(),
      params.originalName,
      params.mimeType,
      params.size,
      params.userId,
      new Date(),
    );
  }

  static restore(params: {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    userId: string;
    createdAt: Date;
  }): FileAggregate {
    return new FileAggregate(
      params.id,
      params.originalName,
      params.mimeType,
      params.size,
      params.userId,
      params.createdAt,
    );
  }
}
