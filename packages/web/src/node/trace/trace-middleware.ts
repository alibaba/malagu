import { TraceIdResolver } from './trace-protocol';
import { Middleware } from '../middleware';
import { Context } from '../context';
import { Logger as Log } from 'loglevel';
import { Component, Autowired, DefaultLogger, Logger } from '@malagu/core';
import { TRACE_MIDDLEWARE_PRIORITY, TRACE_ID_RESPONSE_FIELD } from './trace-protocol';

@Component(Middleware)
export class TraceMiddleware implements Middleware {

    @Autowired(TraceIdResolver)
    protected readonly traceIdResolver: TraceIdResolver;

    private readonly _logger: Log;

    constructor(@Autowired(Logger) protected readonly logger: DefaultLogger) {
        this._logger = this.logger.child({ component: 'malagu:web:trace' });
    }

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const method = ctx.request.method;
        const path = ctx.request.path;
        const traceId = await this.traceIdResolver.resolve();
        this._logger.info(`starting ${method} ${path} with traceId[${traceId}]`);
        const now = Date.now();

        Context.setTraceId(traceId);
        ctx.response.setHeader(TRACE_ID_RESPONSE_FIELD, traceId);
        try {
          await next();
        } finally {
          this._logger.info(`ending ${method} ${path} with traceId[${traceId}], cost ${Date.now() - now}ms`);
        }
    }

    readonly priority = TRACE_MIDDLEWARE_PRIORITY;

}
