// Be sure this middleware is always at first position
import { Context } from '../context';

export const TRACE_MIDDLEWARE_PRIORITY = 2200;

export const TRACE_ID_REQUEST_FIELD = 'malagu.trace.requestField';
export const TRACE_ID_RESPONSE_FIELD = 'malagu.trace.responseField';

export const TraceIdResolver = Symbol('TraceIdResolver');

export interface TraceIdResolver {
    resolve(ctx: Context): Promise<string>;
}
