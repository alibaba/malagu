import { Context } from '../context';
import { MiddlewareProvider } from '../middleware';
import { ErrorHandlerProvider } from '../error/error-hander-provider';
import { Dispatcher } from './dispatcher-protocol';
import { Component, Autowired } from '@malagu/core';
import { HandlerExecutionChain } from '../handler/handler-protocol';

@Component(Dispatcher)
export class DispatcherImpl implements Dispatcher<Context> {

    @Autowired(HandlerExecutionChain)
    protected handlerExecutionChain: HandlerExecutionChain;

    @Autowired
    protected middlewareProvider: MiddlewareProvider;

    @Autowired
    protected errorHandlerProvider: ErrorHandlerProvider;

    async dispatch(ctx: Context): Promise<void> {
        try {
            Context.setCurrent(ctx);
            const middlewares = this.middlewareProvider.provide();
            await this.handlerExecutionChain.execute(middlewares);
        } catch (err) {
            await this.handleError(ctx, err);
        }
    }

    protected async handleError(ctx: Context, err: Error): Promise<void> {
        const errorHandlers = this.errorHandlerProvider.provide();
        for (const handler of errorHandlers) {
            if (await handler.canHandle(ctx, err)) {
                try {
                    await handler.handle(ctx, err);
                } catch (error) {
                    continue;
                }
                return;
            }
        }
    }
}
