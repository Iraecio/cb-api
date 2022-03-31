import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  enabled?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  passwordConfirm?: string;
}
