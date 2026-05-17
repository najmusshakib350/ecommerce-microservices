import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMqConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqConsumerService.name);
  private connection: any;
  private channel: any;
  private readonly fanoutExchange = 'ecommerce.fanout';

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('RABBITMQ_URL');
    if (!url) throw new Error('RABBITMQ_URL is missing');

    this.connection = await connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(this.fanoutExchange, 'fanout', {
      durable: true,
    });

    const fanoutQueue = 'user.order.created.fanout.queue';
    await this.channel.assertQueue(fanoutQueue, { durable: true });
    await this.channel.bindQueue(fanoutQueue, this.fanoutExchange, '');
    await this.channel.consume(fanoutQueue, (msg: ConsumeMessage | null) =>
      this.handleFanout(msg),
    );

    this.logger.log('User fanout consumer connected');
  }

  private handleFanout(msg: ConsumeMessage | null) {
    if (!msg) return;
    this.logger.log(`Fanout event in user-service: ${msg.content.toString()}`);
    this.channel.ack(msg);
  }
}

