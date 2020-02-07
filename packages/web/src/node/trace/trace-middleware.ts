import { TraceIdResolver } from './trace-id-resolver-protocol';
import { Middleware } from '../middleware';
import { Context } from '../context';
import { Component, Autowired, Logger } from '@malagu/core';
import { TRACE_MIDDLEWARE_PRIORITY, RESPONSE_TRACE_ID_FIELD } from './trace-protocol';

@Component(Middleware)
export class TraceMiddleware implements Middleware {

    @Autowired(TraceIdResolver)
    protected readonly traceIdResolver: TraceIdResolver;

    @Autowired(Logger)
    protected readonly logger: Logger;

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const method = ctx.request.method;
        const path = ctx.request.path;
        const uuid = this.traceIdResolver.resolve(ctx);
        this.logger.info(`starting ${method} ${path} with traceId[${uuid}]`);
        const now = Date.now();

        Context.setTraceId(uuid);
        ctx.response.setHeader(RESPONSE_TRACE_ID_FIELD, uuid);

        await next();
        this.logger.info(`ending ${method} ${path} with traceId[${uuid}], cost ${Date.now() - now}ms`);
    }

    readonly priority = TRACE_MIDDLEWARE_PRIORITY;

}
