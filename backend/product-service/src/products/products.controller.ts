import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { productImageMulterOptions } from '../upload/multer.config';
import { productImagePipe } from '../upload/product-image.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductWithImageDto } from './dto/create-product-with-image.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Post('with-image')
  @UseInterceptors(FileInterceptor('image', productImageMulterOptions))
  createWithImage(
    @Body() dto: CreateProductWithImageDto,
    @UploadedFile(productImagePipe)
    file: Express.Multer.File,
  ) {
    return this.products.createWithImage(dto, file);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image', productImageMulterOptions))
  updateImage(
    @Param('id') id: string,
    @UploadedFile(productImagePipe)
    file: Express.Multer.File,
  ) {
    return this.products.updateImage(id, file);
  }

  @Get()
  list() {
    return this.products.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.products.getById(id);
  }
}
