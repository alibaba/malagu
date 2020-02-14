import { getLogger, Logger as Log, LogLevelDesc } from 'loglevel';
import * as chalk from 'chalk';
import { Component, Value } from '../annotation';
import { Logger, AbstractLogger, LOGGER_LEVEL, LogLevel } from './logger-protocol';

@Component(Logger)
export class DefaultLogger extends AbstractLogger<Log> {

    @Value(LOGGER_LEVEL)
    protected readonly level: LogLevelDesc;

    child(option?: { component: string}) {
        let component = 'malagu';
        if (option?.component) {
            component = option.component;
        }
        const logger = getLogger(component);
        logger.setDefaultLevel(this.level);
        return this.proxyLogger(logger, this.formatPrefix, component);
    }

    formatPrefix(level: LogLevel, component: string) {
        const colors: { [key: string]: any} = {
          TRACE: chalk.magenta,
          DEBUG: chalk.cyan,
          INFO: chalk.blue,
          WARN: chalk.yellow,
          ERROR: chalk.red,
        };
        const localeStringOptions = {
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          day: '2-digit',
          month: '2-digit',
        };
        const timestamp = new Date(Date.now()).toLocaleString(
          undefined,
          localeStringOptions,
        );
        // 2020-02-14 12:00:00,069 INFO
        return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level.toUpperCase())} ${chalk.green(`${component}:`)}`;
    }
}
