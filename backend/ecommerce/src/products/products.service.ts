import { Injectable } from '@nestjs/common';
import { ProductServiceClient } from '../clients/product-service.client';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithImageDto } from './dto/create-product-with-image.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productClient: ProductServiceClient) {}

  create(dto: CreateProductDto) {
    return this.productClient.create(dto);
  }

  createWithImage(dto: CreateProductWithImageDto, file: Express.Multer.File) {
    return this.productClient.createWithImage(dto, file);
  }

  updateImage(id: string, file: Express.Multer.File) {
    return this.productClient.updateImage(id, file);
  }

  list() {
    return this.productClient.list();
  }

  getById(id: string) {
    return this.productClient.getById(id);
  }
}
