export class UploadFileCommand {
  constructor(
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly data: Buffer,
    public readonly userId: string,
  ) {}
}
