import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { ImageMimeTypeValidator } from './image-file.validator';
import { MAX_PRODUCT_IMAGE_SIZE } from './multer.config';

export const productImagePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_PRODUCT_IMAGE_SIZE }),
    new ImageMimeTypeValidator(),
  ],
});
