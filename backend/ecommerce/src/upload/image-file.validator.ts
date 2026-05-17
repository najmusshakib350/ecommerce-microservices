import { FileValidator } from '@nestjs/common';

const ALLOWED_IMAGE_MIME = /^image\/(jpeg|png|webp|gif)$/;

export class ImageMimeTypeValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    return Boolean(file?.mimetype && ALLOWED_IMAGE_MIME.test(file.mimetype));
  }

  buildErrorMessage(file?: Express.Multer.File): string {
    return `Validation failed (current file type is ${file?.mimetype ?? 'unknown'}, expected image/jpeg, image/png, image/webp, or image/gif)`;
  }
}
