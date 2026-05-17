// import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PrismaService } from '../prisma/prisma.service';
// import Redis from 'ioredis';
// import { existsSync, unlinkSync } from 'fs';
// import { join } from 'path';
// import { PRODUCT_UPLOAD_DIR } from '../upload/multer.config';
// import { CreateProductDto } from './dto/create-product.dto';
// import { CreateProductWithImageDto } from './dto/create-product-with-image.dto';

// @Injectable()
// export class ProductsService {
//   private readonly redis: Redis;
//   private readonly cacheKey = 'products:all';

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly config: ConfigService,
//   ) {
//     this.redis = new Redis(this.config.getOrThrow<string>('REDIS_URL'));
//   }

//   async create(dto: CreateProductDto) {
//     const product = await this.prisma.product.create({ data: dto });
//     await this.invalidateCache();
//     return product;
//   }

//   async createWithImage(dto: CreateProductWithImageDto, file: Express.Multer.File) {
//     const imageUrl = this.buildPublicImageUrl(file.filename);
//     const product = await this.prisma.product.create({
//       data: { ...dto, imageUrl },
//     });
//     await this.invalidateCache();
//     return product;
//   }

//   async updateImage(id: string, file: Express.Multer.File) {
//     const product = await this.getById(id);
//     this.removeStoredFile(product.imageUrl);

//     const imageUrl = this.buildPublicImageUrl(file.filename);
//     const updated = await this.prisma.product.update({
//       where: { id },
//       data: { imageUrl },
//     });
//     await this.invalidateCache();
//     return updated;
//   }

//   async list() {
//     const cached = await this.redis.get(this.cacheKey);
//     if (cached) return JSON.parse(cached);

//     const products = await this.prisma.product.findMany({
//       orderBy: { createdAt: 'desc' },
//     });
//     await this.redis.set(this.cacheKey, JSON.stringify(products), 'EX', 30);
//     return products;
//   }

//   async getById(id: string) {
//     const product = await this.prisma.product.findUnique({ where: { id } });
//     if (!product) throw new NotFoundException('Product not found');
//     return product;
//   }

//   async reduceStock(productId: string, quantity: number) {
//     const product = await this.prisma.product.findUnique({ where: { id: productId } });
//     if (!product) throw new NotFoundException('Product not found');

//     const newStock = Math.max(0, product.stock - quantity);
//     const updated = await this.prisma.product.update({
//       where: { id: productId },
//       data: { stock: newStock },
//     });
//     await this.invalidateCache();
//     return updated;
//   }

//   private buildPublicImageUrl(filename: string): string {
//     const base = this.config.get<string>('PUBLIC_BASE_URL', 'http://localhost:3002');
//     return `${base.replace(/\/$/, '')}/uploads/products/${filename}`;
//   }

//   private removeStoredFile(imageUrl: string | null) {
//     if (!imageUrl) return;
//     const filename = imageUrl.split('/').pop();
//     if (!filename) return;
//     const filePath = join(PRODUCT_UPLOAD_DIR, filename);
//     if (existsSync(filePath)) unlinkSync(filePath);
//   }

//   private async invalidateCache() {
//     await this.redis.del(this.cacheKey);
//   }
// }

import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PRODUCT_UPLOAD_DIR } from '../upload/multer.config';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithImageDto } from './dto/create-product-with-image.dto';

@Injectable()
export class ProductsService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly cacheKey = 'products:all';

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.redis = new Redis(this.config.getOrThrow<string>('REDIS_URL'), {
      tls: {},
      maxRetriesPerRequest: null,
    });
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({ data: dto });
    await this.invalidateCache();
    return product;
  }

  async createWithImage(
    dto: CreateProductWithImageDto,
    file: Express.Multer.File,
  ) {
    const imageUrl = this.buildPublicImageUrl(file.filename);

    const product = await this.prisma.product.create({
      data: { ...dto, imageUrl },
    });

    await this.invalidateCache();
    return product;
  }

  async updateImage(id: string, file: Express.Multer.File) {
    const product = await this.getById(id);
    this.removeStoredFile(product.imageUrl);

    const imageUrl = this.buildPublicImageUrl(file.filename);

    const updated = await this.prisma.product.update({
      where: { id },
      data: { imageUrl },
    });

    await this.invalidateCache();
    return updated;
  }

  async list() {
    try {
      const cached = await this.redis.get(this.cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn('Redis cache get failed:', err.message);
      } else {
        console.warn('Redis cache get failed: unknown error');
      }
    }

    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    try {
      await this.redis.set(this.cacheKey, JSON.stringify(products), 'EX', 30);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn('Redis cache set failed:', err.message);
      } else {
        console.warn('Redis cache set failed: unknown error');
      }
    }

    return products;
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async reduceStock(productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    const newStock = Math.max(0, product.stock - quantity);

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });

    await this.invalidateCache();
    return updated;
  }

  private buildPublicImageUrl(filename: string): string {
    const base =
      this.config.get<string>('PUBLIC_BASE_URL') || 'http://localhost:3002';

    return `${base.replace(/\/$/, '')}/uploads/products/${filename}`;
  }

  private removeStoredFile(imageUrl: string | null) {
    if (!imageUrl) return;

    const filename = imageUrl.split('/').pop();
    if (!filename) return;

    const filePath = join(PRODUCT_UPLOAD_DIR, filename);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  private async invalidateCache() {
    try {
      await this.redis.del(this.cacheKey);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.warn('Redis delete failed:', err.message);
      } else {
        console.warn('Redis delete failed: unknown error');
      }
    }
  }

  async onModuleDestroy() {
    this.redis.disconnect();
  }
}
