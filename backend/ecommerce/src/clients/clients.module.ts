import { Global, Module } from '@nestjs/common';
import { AppHttpModule } from '../http/http.module';
import { OrderServiceClient } from './order-service.client';
import { ProductServiceClient } from './product-service.client';
import { UserServiceClient } from './user-service.client';

@Global()
@Module({
  imports: [AppHttpModule],
  providers: [UserServiceClient, ProductServiceClient, OrderServiceClient],
  exports: [
    AppHttpModule,
    UserServiceClient,
    ProductServiceClient,
    OrderServiceClient,
  ],
})
export class ClientsModule {}
