import { Component, Value, Autowired } from '@malagu/core';
import { SecurityContextStore, SecurityContext, SecurityContextStrategy } from './context-protocol';
import { Context } from '@malagu/web/lib/node';

@Component(SecurityContextStore)
export class SessionSecurityContextStore implements SecurityContextStore {

    @Value('malagu.security')
    protected readonly options: any;

    @Autowired(SecurityContextStrategy)
    protected readonly securityContextStrategy: SecurityContextStrategy;

    async load(): Promise<SecurityContext> {
        const context = Context.getSession()[this.options.contextKey];
        if (!context) {
            const result = await this.securityContextStrategy.create();
            return result;
        }
        return context;
    }
    async save(context: SecurityContext): Promise<void> {
        Context.getSession()[this.options.contextKey] = context;
    }

}
