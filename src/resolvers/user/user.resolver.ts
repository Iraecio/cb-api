import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Auth } from '../../models/auth.model';
import { Public } from '../../@core/@keycloak';
import { UserCreateInput } from './input/user-create.input';
import { UserService } from './user.service';

@Resolver((of) => Auth)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => Auth)
  @Public()
  async create(@Context() ctx, @Args('data') dados: UserCreateInput) {
    return await this.userService.create(dados);
  }
}
