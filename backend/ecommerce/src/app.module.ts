import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { RabbitMqConsumerService } from './rabbitmq/rabbitmq-consumer.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    ClientsModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqConsumerService],
})
export class AppModule {}
