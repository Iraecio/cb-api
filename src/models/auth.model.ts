import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Auth {
    @Field(type => String)
    access_token: string;

    @Field(type => String)
    expires_in: string;

    @Field(type => String)
    refresh_expires_in: string

    @Field(type => String)
    refresh_token: string;

    @Field(type => String)
    token_type: string;

    @Field(type => String)
    session_state: string;

    @Field(type => String)
    scope: string;

}
