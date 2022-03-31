import { LoginInput } from './input/login.input';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from '../../models/auth.model';
import { Public } from '../../@core/@keycloak';
import { Logout } from '../../models/logout.model';
import { AuthenticatedUser } from '../../@core/@keycloak';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { GqlCookies } from '../../@core/guards/gql-cookie.decorator';
import { RefreshInput } from './input/refresh.input';
import { UserKc } from '../../models/user-kc.model';

@Resolver((of) => Auth)
//@Resource('profile')
export class AuthResolver {
  constructor(
    @InjectRedis('cabir') private readonly redis: Redis,
    private readonly authService: AuthService
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => Auth)
  @Public()
  async login(
    @Context() ctx,
    @GqlCookies() cookies,
    @Args('data') { username, password }: LoginInput
  ) {
    const data = await this.authService.login(username, password);

    await this.redis.set(
      data?.session_state,
      JSON.stringify(data),
      'EX',
      data?.refresh_expires_in
    );

    return data;
  }

  @Mutation((returns) => Logout)
  async logout(@AuthenticatedUser() user: any) {
    const sessUserId = user?.session_state;
    const { refresh_token } = JSON.parse(await this.redis.get(sessUserId));
    const data = await this.authService.logout(refresh_token);
    if (data) {
      await this.redis.del(sessUserId);
    }
    return data;
  }

  @Mutation((returns) => Auth)
  @Public()
  async refresh(@Args('data') { refresh }: RefreshInput) {
    const data = await this.authService.refreshToken(refresh);
    await this.redis.set(
      data?.session_state,
      JSON.stringify(data),
      'EX',
      data?.refresh_expires_in
    );
    return data;
  }

  @Mutation((returns) => UserKc)
  async me(@Context() ctx) {
    return await this.authService.me(ctx?.req?.accessTokenJWT);
  }
}
