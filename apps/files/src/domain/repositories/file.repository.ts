import { FileAggregate } from '../aggregates/files.aggregate.ts';

export abstract class FileRepository {
  abstract save(file: FileAggregate, data: Buffer): Promise<void>;

  abstract findById(id: string): Promise<{
    file: FileAggregate;
    data: Buffer;
  } | null>;

  abstract delete(fileId: string, userId: string): Promise<void>;
}