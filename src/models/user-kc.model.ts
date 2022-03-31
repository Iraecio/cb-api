import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserKc {
  @Field((type) => String)
  sub: string;

  @Field((type) => Boolean)
  email_verified: boolean;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  preferred_username: string;

  @Field((type) => String)
  given_name: string;

  @Field((type) => String)
  family_name: string;

  @Field((type) => String)
  email: string;
}
