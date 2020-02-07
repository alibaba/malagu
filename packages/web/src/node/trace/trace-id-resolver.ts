import { v4 } from 'uuid';
import { Component, Value } from '@malagu/core';
import { TraceIdResolver } from './trace-id-resolver-protocol';
import { Context } from '../context';
import { TRACE_ID_FIELD } from './trace-protocol';

@Component(TraceIdResolver)
export class TraceIdResolverImpl implements TraceIdResolver {
    @Value(TRACE_ID_FIELD)
    protected readonly traceField: string;

    resolve(ctx: Context): string {
        if (ctx.request && this.traceField ) {
            const traceId = ctx.request.headers[this.traceField] as string | undefined;
            if (traceId) {
                return traceId;
            }
        }
        return v4();
    }
}
