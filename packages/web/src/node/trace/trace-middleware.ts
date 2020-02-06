import { Middleware } from '../middleware';
import { Context } from '../context';
import { Component } from '@malagu/core';
import { v4 } from "uuid";
import { TRACE_MIDDLEWARE_PROTOCOL } from './trace-protocol';

@Component(Middleware)
export class TraceMiddleware implements Middleware {

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
      if (ctx.request) {
        // TODO: 这里记录请求的开始和结束日志，并打印出请求的耗时
        const _uuid = v4();
        ctx.request.uuid = _uuid;
        ctx.response.setHeader("uuid", _uuid)
      }
      await next();
    }

    readonly priority = TRACE_MIDDLEWARE_PROTOCOL;

}
