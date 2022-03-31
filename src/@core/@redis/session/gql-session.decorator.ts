import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const GqlSession = GqlExecutionContext.create(ctx);
    const request = GqlSession.getContext().req;
    return request?.session || request;
  }
);
