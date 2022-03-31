import { Injectable } from '@nestjs/common';
import { KeycloakService } from '../../@core/service/keycloak.service';
import { UserCreateInput } from './input/user-create.input';

@Injectable()
export class UserService {
  constructor(private keycloak: KeycloakService) {}

  async create(data: UserCreateInput) {
    return await this.keycloak.createUser(data);
  }

  getUserInput(dados: UserCreateInput) {
    let result = {};
  }
}
