import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMqConsumerService } from './rabbitmq/rabbitmq-consumer.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, RabbitMqConsumerService],
})
export class AppModule {}
