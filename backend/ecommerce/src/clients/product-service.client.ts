import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES } from '../common/constants';
import { Product } from '../common/types/product.type';
import { rethrowDownstreamError } from '../common/utils/downstream-error.util';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { CreateProductWithImageDto } from '../products/dto/create-product-with-image.dto';

@Injectable()
export class ProductServiceClient {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.getOrThrow<string>('services.product');
  }

  async create(dto: CreateProductDto): Promise<Product> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<Product>(`${this.baseUrl}/products`, dto),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.product} is unavailable`);
    }
  }

  async createWithImage(
    dto: CreateProductWithImageDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    try {
      const form = new FormData();
      form.append('title', dto.title);
      form.append('price', String(dto.price));
      form.append('stock', String(dto.stock));
      form.append('image', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const { data } = await firstValueFrom(
        this.http.post<Product>(`${this.baseUrl}/products/with-image`, form, {
          headers: form.getHeaders(),
        }),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.product} is unavailable`);
    }
  }

  async updateImage(id: string, file: Express.Multer.File): Promise<Product> {
    try {
      const form = new FormData();
      form.append('image', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const { data } = await firstValueFrom(
        this.http.patch<Product>(`${this.baseUrl}/products/${id}/image`, form, {
          headers: form.getHeaders(),
        }),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.product} is unavailable`);
    }
  }

  async list(): Promise<Product[]> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<Product[]>(`${this.baseUrl}/products`),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.product} is unavailable`);
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<Product>(`${this.baseUrl}/products/${id}`),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.product} is unavailable`);
    }
  }
}
