import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ConsumeMessage } from 'amqplib';
import {
  GATEWAY_FANOUT_QUEUE,
  RABBITMQ_EXCHANGES,
} from '../common/constants';
import { OrderCreatedEvent } from '../common/types/order.type';

@Injectable()
export class RabbitMqConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqConsumerService.name);
  private connection: any;
  private channel: any;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('rabbitmq.url');
    if (!url) {
      this.logger.warn('RABBITMQ_URL is missing; gateway event consumer disabled');
      return;
    }

    this.connection = await connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(RABBITMQ_EXCHANGES.fanout, 'fanout', {
      durable: true,
    });

    await this.channel.assertQueue(GATEWAY_FANOUT_QUEUE, { durable: true });
    await this.channel.bindQueue(
      GATEWAY_FANOUT_QUEUE,
      RABBITMQ_EXCHANGES.fanout,
      '',
    );
    await this.channel.consume(GATEWAY_FANOUT_QUEUE, (msg: ConsumeMessage | null) =>
      this.handleOrderCreated(msg),
    );

    this.logger.log('Gateway fanout consumer connected');
  }

  private handleOrderCreated(msg: ConsumeMessage | null) {
    if (!msg) return;

    const payload = JSON.parse(msg.content.toString()) as OrderCreatedEvent;
    this.logger.log(
      `Order orchestrated event: orderId=${payload.orderId} userId=${payload.userId} productId=${payload.productId}`,
    );
    this.channel.ack(msg);
  }
}
