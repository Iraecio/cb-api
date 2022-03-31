import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from '../../@core/core.module';
import { KeycloakConnectModule } from '../../@core/@keycloak';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [HttpModule, CoreModule, KeycloakConnectModule],
  providers: [UserService, UserResolver],
  exports: [],
})
export class UserModule {}
