import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        timeout: config.get<number>('httpTimeoutMs', 5000),
        maxRedirects: 0,
      }),
    }),
  ],
  exports: [HttpModule],
})
export class AppHttpModule {}
