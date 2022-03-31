import { AuthModule } from './resolvers/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, Module } from '@nestjs/common';
import { CoreModule } from './@core/core.module';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import {
  RedisClientOptions,
  RedisModule,
  RedisModuleOptions,
  RedisService,
} from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from './@core/@redis/throttler';
import * as redisStore from 'cache-manager-redis-store';
import { UserModule } from './resolvers/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService): RedisModuleOptions {
        return {
          closeClient: true,
          readyLog: true,
          config: {
            namespace: 'cabir',
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
            password: config.get('REDIS_PASSWORD'),
          },
        };
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          isGlobal: true,
          store: redisStore,
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD'),
          ttl: 120,
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory(redisService: RedisService) {
        const redis = redisService.getClient('cabir');
        return {
          ttl: 60,
          limit: 10,
          storage: new ThrottlerStorageRedisService(redis),
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      cors: true,
      debug: true,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      autoTransformHttpErrors: true,
      context: ({ req }) => ({ req }),
    }),
    CoreModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
