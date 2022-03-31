import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from '../../@keycloak';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private config: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      realm: 'cabir',
      public: false,
      realmPublicKey: this.config.get('CABIR_JWT_SECRET'),
      authServerUrl: this.config.get('KEYCLOAK_BASE_URL'),
      clientId: this.config.get('CABIR_CLIENT_ID'),
      secret: this.config.get('CABIR_CLIENT_SECRET'),
      cookieKey: 'KEYCLOAK_JWT',
      useNestLogger: true,
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.OFFLINE,
    };
  }
}
