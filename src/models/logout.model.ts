import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Logout {
  @Field((type) => Number)
  status: number;

  @Field((type) => String)
  message: string;

  @Field((type) => String)
  redirectUri: string;
}
