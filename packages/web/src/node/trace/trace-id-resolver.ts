import { v4 } from 'uuid';
import { Component, Value } from '@malagu/core';
import { TraceIdResolver } from './trace-protocol';
import { Context } from '../context';
import { TRACE_ID_FIELD } from './trace-protocol';

@Component(TraceIdResolver)
export class TraceIdResolverImpl implements TraceIdResolver {
    @Value(TRACE_ID_FIELD)
    protected readonly traceField: string;

    resolve(ctx: Context): Promise<string> {
        if (ctx.request && this.traceField ) {
            const traceId = ctx.request.headers[this.traceField] as string | undefined;
            if (traceId) {
                return Promise.resolve(traceId);
            }
        }
        return Promise.resolve(v4());
    }
}
