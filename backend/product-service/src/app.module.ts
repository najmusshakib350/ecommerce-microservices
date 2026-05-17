import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { RabbitMqConsumerService } from './rabbitmq/rabbitmq-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService, RabbitMqConsumerService],
})
export class AppModule {}
