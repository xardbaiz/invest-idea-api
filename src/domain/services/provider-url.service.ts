export const DEFAULT_PROVIDER_BASE_URLS: Record<string, string> = {
    tradernet: 'https://freedom24.com/ideas/details/',
};

export class ProviderUrlService {
    private readonly baseUrls: Map<string, string>;

    constructor(customUrls?: Record<string, string>) {
        this.baseUrls = new Map(
            Object.entries({
                ...DEFAULT_PROVIDER_BASE_URLS,
                ...customUrls,
            }).map(([k, v]) => [k.toLowerCase(), v])
        );
    }

    getIdeaUrl(provider?: string, ideaId?: string): string {
        if (!provider || !ideaId) {
            return '#';
        }

        const normProvider = provider.toLowerCase();
        const baseUrl = this.baseUrls.get(normProvider);
        if (!baseUrl) {
            return '#';
        }

        const prefix = `${normProvider}_`;
        const rawId = ideaId.toLowerCase().startsWith(prefix)
            ? ideaId.slice(prefix.length)
            : ideaId;

        return `${baseUrl}${rawId}`;
    }
}
