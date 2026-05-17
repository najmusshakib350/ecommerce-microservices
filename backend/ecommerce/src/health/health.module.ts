import { Module } from '@nestjs/common';
import { AppHttpModule } from '../http/http.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [AppHttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
