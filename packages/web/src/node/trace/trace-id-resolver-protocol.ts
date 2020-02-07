import { Context } from '../context';

export const TraceIdResolver = Symbol('TraceIdResolver');

export interface TraceIdResolver {
    resolve(ctx: Context): string;
}
