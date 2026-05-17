import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbit: RabbitMqService,
  ) {}

  async create(dto: CreateOrderDto) {
    const totalPrice = dto.unitPrice * dto.quantity;
    const order = await this.prisma.order.create({
      data: {
        ...dto,
        totalPrice,
      },
    });

    const event = {
      orderId: order.id,
      userId: order.userId,
      productId: order.productId,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
    };

    await this.rabbit.publishDirect('order.created', event);
    await this.rabbit.publishFanout(event);

    return order;
  }

  async list() {
    return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  }
}

