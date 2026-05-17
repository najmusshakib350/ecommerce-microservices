import { memoryStorage } from 'multer';

export const gatewayImageMulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
};
