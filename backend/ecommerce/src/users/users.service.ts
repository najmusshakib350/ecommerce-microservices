import { Injectable } from '@nestjs/common';
import { UserServiceClient } from '../clients/user-service.client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userClient: UserServiceClient) {}

  create(dto: CreateUserDto) {
    return this.userClient.create(dto);
  }

  list() {
    return this.userClient.list();
  }

  getById(id: string) {
    return this.userClient.getById(id);
  }

  update(id: string, dto: UpdateUserDto) {
    return this.userClient.update(id, dto);
  }
}
