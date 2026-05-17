import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { ImageMimeTypeValidator } from './image-file.validator';

const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;

export const productImagePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_PRODUCT_IMAGE_SIZE }),
    new ImageMimeTypeValidator(),
  ],
});
