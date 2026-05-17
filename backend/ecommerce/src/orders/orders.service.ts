import {
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { OrderServiceClient } from '../clients/order-service.client';
import { ProductServiceClient } from '../clients/product-service.client';
import { UserServiceClient } from '../clients/user-service.client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderClient: OrderServiceClient,
    private readonly userClient: UserServiceClient,
    private readonly productClient: ProductServiceClient,
  ) {}

  async create(dto: CreateOrderDto) {
    await this.ensureUserExists(dto.userId);
    const product = await this.ensureProductAvailable(dto.productId, dto.quantity);

    return this.orderClient.create({
      userId: dto.userId,
      productId: dto.productId,
      unitPrice: product.price,
      quantity: dto.quantity,
    });
  }

  list() {
    return this.orderClient.list();
  }

  private async ensureUserExists(userId: string) {
    try {
      await this.userClient.getById(userId);
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === 404) {
        throw new BadRequestException(`User ${userId} does not exist`);
      }
      throw error;
    }
  }

  private async ensureProductAvailable(productId: string, quantity: number) {
    try {
      const product = await this.productClient.getById(productId);
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${productId}`,
        );
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === 404) {
        throw new BadRequestException(`Product ${productId} does not exist`);
      }
      throw error;
    }
  }
}
