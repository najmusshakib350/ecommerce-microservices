import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'ecommerce-api-gateway',
      description: 'Main entry point for ecommerce microservices',
      routes: {
        users: '/users',
        products: '/products',
        orders: '/orders',
        health: '/health',
      },
    };
  }
}
