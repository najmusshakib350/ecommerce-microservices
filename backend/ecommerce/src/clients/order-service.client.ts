import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES } from '../common/constants';
import { Order } from '../common/types/order.type';
import { rethrowDownstreamError } from '../common/utils/downstream-error.util';
import { CreateOrderPayload } from '../orders/dto/create-order-payload.type';

@Injectable()
export class OrderServiceClient {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.getOrThrow<string>('services.order');
  }

  async create(payload: CreateOrderPayload): Promise<Order> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<Order>(`${this.baseUrl}/orders`, payload),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.order} is unavailable`);
    }
  }

  async list(): Promise<Order[]> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<Order[]>(`${this.baseUrl}/orders`),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.order} is unavailable`);
    }
  }
}
