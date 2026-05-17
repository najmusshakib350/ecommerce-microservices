import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES } from '../common/constants';

type ServiceHealth = {
  name: string;
  url: string;
  status: 'up' | 'down';
};

@Injectable()
export class HealthService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async check() {
    const checks = await Promise.all([
      this.pingService(SERVICE_NAMES.user, this.config.getOrThrow('services.user')),
      this.pingService(
        SERVICE_NAMES.product,
        this.config.getOrThrow('services.product'),
      ),
      this.pingService(
        SERVICE_NAMES.order,
        this.config.getOrThrow('services.order'),
      ),
    ]);

    const status = checks.every((item) => item.status === 'up') ? 'ok' : 'degraded';

    return {
      status,
      gateway: 'ecommerce-api-gateway',
      services: checks,
      checkedAt: new Date().toISOString(),
    };
  }

  private async pingService(name: string, baseUrl: string): Promise<ServiceHealth> {
    try {
      await firstValueFrom(this.http.get(baseUrl, { timeout: 3000 }));
      return { name, url: baseUrl, status: 'up' };
    } catch {
      return { name, url: baseUrl, status: 'down' };
    }
  }
}
