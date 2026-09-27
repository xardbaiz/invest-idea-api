import {InvestmentProvider} from './investment-provider.js';
import {TradernetProvider} from '../../outbound/clients/tradernet.js';

export class ProviderRegistry {
    private readonly providers = new Map<string, InvestmentProvider>();

    constructor(providers: InvestmentProvider[] = []) {
        for (const provider of providers) {
            this.register(provider);
        }
    }

    register(provider: InvestmentProvider): void {
        this.providers.set(provider.name.toLowerCase(), provider);
    }

    getProvider(name?: string): InvestmentProvider | undefined {
        if (!name) {
            return undefined;
        }
        return this.providers.get(name.toLowerCase());
    }

    getIdeaUrl(providerName?: string, ideaId?: string): string {
        if (!providerName || !ideaId) {
            return '#';
        }
        const provider = this.getProvider(providerName);
        if (!provider) {
            return '#';
        }
        return provider.getIdeaUrl(ideaId);
    }
}

export function createDefaultProviderRegistry(): ProviderRegistry {
    return new ProviderRegistry([new TradernetProvider()]);
}
