import { Module } from '@nestjs/common';
import { ConfigKeycloakModule } from './config/keycloak/keycloak-config.module';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { KeycloakConfigService } from './config/keycloak/keycloak-config.service';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakConnectModule, ResourceGuard, RoleGuard } from './@keycloak';
import { KeycloakService } from './service/keycloak.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [ConfigKeycloakModule],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    KeycloakService,
  ],
  exports: [KeycloakConnectModule, KeycloakService],
})
export class CoreModule {}
