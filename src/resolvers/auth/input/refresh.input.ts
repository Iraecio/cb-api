import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RefreshInput {
  @Field()
  @IsNotEmpty()
  refresh: string;
}
