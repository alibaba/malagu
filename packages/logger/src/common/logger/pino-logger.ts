import { Logger, LOGGER_CONFIG, Value, Component, Autowired, Optional } from '@malagu/core';
import { Context } from '@malagu/web/lib/node';
import * as pino from 'pino';
import { PinoConfig, PinoDestinationConfig } from './pino-logger-protocol';

@Component({ id: Logger, rebind: true})
export class PinoLogger implements Logger {

    protected logger: pino.Logger;

    constructor (
        @Value(LOGGER_CONFIG)
        protected readonly config: any,
        @Autowired(PinoConfig)
        @Optional()
        protected readonly pinoConfig1: PinoConfig,
        @Autowired(PinoDestinationConfig)
        @Optional()
        protected readonly destinationConfig: PinoDestinationConfig
    ) {
        const { pinoConfig } = this.config;
        this.logger = pino({ ...pinoConfig, ...pinoConfig1 }, destinationConfig);
    }

    public getRawLogger() {
        return this.logger;
    }

    protected getMessagePrefix() {
        if (Context.getCurrent()) {
            const traceId = Context.getTraceId();
            const path = Context.getRequest().path;
            const method = Context.getRequest().method;
            return  `${method.toLocaleUpperCase()} ${path}${traceId ? ` with ${traceId}` : ''}`;
        }

        return '';
    }

    error(message: string, prefix = this.getMessagePrefix()) {
        this.logger.error(`${prefix} ${message}`);
    }

    warn(message: string, prefix = this.getMessagePrefix()) {
        this.logger.warn(`${prefix} ${message}`);
    }

    info(message: string, prefix = this.getMessagePrefix()) {
        this.logger.info(`${prefix} ${message}`);
    }

    debug(message: string, prefix = this.getMessagePrefix()) {
        this.logger.debug(`${prefix} ${message}`);
    }

    verbose(message: string, prefix = this.getMessagePrefix()) {
        this.logger.trace(`${prefix} ${message}`);
    }
}
