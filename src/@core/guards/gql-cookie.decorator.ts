import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlCookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const gqlctx = GqlExecutionContext.create(ctx);
    const request = gqlctx.getContext().req;
    return data ? request.cookies?.[data] : request.cookies;
  }
);
