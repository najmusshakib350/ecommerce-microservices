import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';

@Injectable()
export class RabbitMqService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqService.name);
  private connection: any;
  private channel: any;
  private readonly directExchange = 'ecommerce.direct';
  private readonly fanoutExchange = 'ecommerce.fanout';

  constructor(private readonly config: ConfigService) {}

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
    this.logger.log('RabbitMQ connected');
  }

  async publishDirect(routingKey: string, payload: Record<string, unknown>) {
    this.channel.publish(
      this.directExchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );
  }

  async publishFanout(payload: Record<string, unknown>) {
    this.channel.publish(
      this.fanoutExchange,
      '',
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );
  }
}

