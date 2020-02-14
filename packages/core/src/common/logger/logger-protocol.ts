import { injectable } from 'inversify';
import * as os from 'os';

export const LOGGER_LEVEL = 'malagu.logger.level';
export const Logger = Symbol('Logger');

export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';

export interface Log {
    info(message: any): void;
    error(message: any): void;
    warn(message: any): void;
    debug?(message: any): void;
    verbose?(message: any): void;
}

@injectable()
export abstract class AbstractLogger<T extends { [key: string]: any}> {
    abstract child(option: { component: string}): T;
    abstract formatPrefix(level: LogLevel, component: string): string;

    proxyLogger(logger: T, component: string, formatPrefix: (level: LogLevel, component: string) => string) {
        return new Proxy(logger, {
            get(target: T, propKey: string) {
                const origMethod = target[propKey];
                const supportMethod = ['verbose', 'debug', 'info', 'warn', 'error'];
                if (supportMethod.indexOf(propKey) === -1) {
                    return (...argument: any[]) => origMethod.apply(this, [...argument]);
                }
                const prefix = formatPrefix(propKey as LogLevel, component);
                return (...argument: any[]) => origMethod.apply(this, [prefix, ...argument]);
            }
        });
    }

    get pid() {
        return !(process as any).browser ? process.getgid() : '';
    }

    get hostname() {
        return !(process as any).browser ? os.hostname() : '';
    }
}
