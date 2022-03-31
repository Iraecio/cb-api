import { Injectable } from '@nestjs/common';
import { KeycloakService } from '../../@core/service/keycloak.service';

@Injectable()
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  async me(token: string) {
    return await this.keycloak.userInfo(token);
  }

  async login(username: string, password: string) {
    return await this.keycloak.login(username, password);
  }

  async refreshToken(refresh: string) {
    return await this.keycloak.refresh(refresh);
  }

  async logout(refresh: string) {
    return await this.keycloak.logout(refresh);
  }
}
