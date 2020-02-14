import { Logger as Log } from 'loglevel';
import { User, UserChecker } from './user-protocol';
import { Component, Autowired, Logger, DefaultLogger } from '@malagu/core';
import { LockedError, AccountExpiredError, DisabledError, CredentialsExpiredError } from '../error';

@Component(UserChecker)
export class UserCheckerImpl implements UserChecker {
    private readonly _logger: Log;

    constructor(@Autowired(Logger) protected readonly logger: DefaultLogger) {
      this._logger = this.logger.child({ component: 'malagu:security:user:checker' });
    }
    async check(user: User): Promise<void> {
        if (!user.accountNonLocked) {
            this._logger.debug('User account is locked');

            throw new LockedError('User account is locked');
        }

        if (!user.enabled) {
            this._logger.debug('User account is disabled');

            throw new DisabledError('User is disabled');
        }

        if (!user.accountNonExpired) {
            this._logger.debug('User account is expired');

            throw new AccountExpiredError('User account has expired');
        }

        if (!user.credentialsNonExpired) {
            this._logger.debug('User account is expired');

            throw new CredentialsExpiredError('User credentials have expired');
        }
    }

}
