import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from '../../@core/core.module';
import { KeycloakConnectModule } from '../../@core/@keycloak';

@Module({
  imports: [HttpModule, CoreModule, KeycloakConnectModule],
  providers: [AuthService, AuthResolver],
  exports: [],
})
export class AuthModule {}
