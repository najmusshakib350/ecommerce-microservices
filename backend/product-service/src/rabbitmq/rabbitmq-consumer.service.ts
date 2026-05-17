import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ConsumeMessage } from 'amqplib';
import { ProductsService } from '../products/products.service';

@Injectable()
export class RabbitMqConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqConsumerService.name);
  private connection: any;
  private channel: any;
  private readonly directExchange = 'ecommerce.direct';
  private readonly fanoutExchange = 'ecommerce.fanout';

  constructor(
    private readonly config: ConfigService,
    private readonly productsService: ProductsService,
  ) {}

  async onModuleInit() {
    const url = this.config.get<string>('RABBITMQ_URL');
    if (!url) throw new Error('RABBITMQ_URL is missing');

    this.connection = await connect(url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.directExchange, 'direct', {
      durable: true,
    });
    await this.channel.assertExchange(this.fanoutExchange, 'fanout', {
      durable: true,
    });

    const directQueue = 'product.order.created.direct.queue';
    await this.channel.assertQueue(directQueue, { durable: true });
    await this.channel.bindQueue(directQueue, this.directExchange, 'order.created');

    await this.channel.consume(directQueue, (msg: ConsumeMessage | null) =>
      this.handleDirect(msg),
    );

    const fanoutQueue = 'product.order.created.fanout.queue';
    await this.channel.assertQueue(fanoutQueue, { durable: true });
    await this.channel.bindQueue(fanoutQueue, this.fanoutExchange, '');
    await this.channel.consume(fanoutQueue, (msg: ConsumeMessage | null) =>
      this.handleFanout(msg),
    );

    this.logger.log('Product consumer connected');
  }

  private async handleDirect(msg: ConsumeMessage | null) {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString()) as {
        productId: string;
        quantity: number;
      };
      await this.productsService.reduceStock(payload.productId, payload.quantity);
      this.channel.ack(msg);
    } catch (error) {
      this.logger.error(`Direct consumer failed: ${(error as Error).message}`);
      this.channel.nack(msg, false, false);
    }
  }

  private handleFanout(msg: ConsumeMessage | null) {
    if (!msg) return;
    this.logger.log(`Fanout event in product-service: ${msg.content.toString()}`);
    this.channel.ack(msg);
  }
}

