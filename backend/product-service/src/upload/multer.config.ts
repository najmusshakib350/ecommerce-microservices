import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { ALLOWED_IMAGE_MIME } from './image-file.validator';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');
export const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const productImageMulterOptions = {
  storage: diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = EXT_BY_MIME[file.mimetype] ?? extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: MAX_PRODUCT_IMAGE_SIZE },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_IMAGE_MIME.test(file.mimetype)) {
      cb(
        new BadRequestException(
          'Only JPEG, PNG, WebP, and GIF images are allowed',
        ),
        false,
      );
      return;
    }
    cb(null, true);
  },
};

export const PRODUCT_UPLOAD_DIR = UPLOAD_DIR;
