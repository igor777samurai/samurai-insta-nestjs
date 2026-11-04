import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteFileCommand } from '../../application/commands/delete-file.command.ts';
import { UploadFileCommand } from '../../application/commands/upload-file.command.ts';
import { DownloadFileQuery } from '../../application/queries/download-file.query.ts';



@Controller()
export class FilesMessageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('files.upload')
  async uploadFile(
    @Payload()
    payload: {
      originalName: string;
      mimeType: string;
      size: number;
      data: string;
      userId: string;
    },
  ) {
    return this.commandBus.execute(
      new UploadFileCommand(
        payload.originalName,
        payload.mimeType,
        Buffer.from(payload.data, 'base64'),
        payload.userId,
      ),
    );
  }

  @MessagePattern('files.download')
  async downloadFile(
    @Payload()
    payload: {
      fileId: string;
      userId: string;
    },
  ) {
    const result = await this.queryBus.execute(
      new DownloadFileQuery(payload.fileId, payload.userId),
    );

    return {
      ...result,
      data: result.data.toString('base64'),
    };
  }

  @MessagePattern('files.delete')
  async deleteFile(
    @Payload()
    payload: {
      fileId: string;
      userId: string;
    },
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteFileCommand(payload.fileId, payload.userId),
    );
  }
}