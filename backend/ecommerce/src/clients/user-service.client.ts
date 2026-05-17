import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES } from '../common/constants';
import { User } from '../common/types/user.type';
import { rethrowDownstreamError } from '../common/utils/downstream-error.util';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class UserServiceClient {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.getOrThrow<string>('services.user');
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<User>(`${this.baseUrl}/users`, dto),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.user} is unavailable`);
    }
  }

  async list(): Promise<User[]> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<User[]>(`${this.baseUrl}/users`),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.user} is unavailable`);
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<User>(`${this.baseUrl}/users/${id}`),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.user} is unavailable`);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      const { data } = await firstValueFrom(
        this.http.patch<User>(`${this.baseUrl}/users/${id}`, dto),
      );
      return data;
    } catch (error) {
      rethrowDownstreamError(error, `${SERVICE_NAMES.user} is unavailable`);
    }
  }
}
