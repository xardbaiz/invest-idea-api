import {ProviderRegistry} from "../provider.registry.js";
import {TradernetProvider} from "../../../outbound/clients/tradernet.js";
import {InvestmentProvider} from "../investment-provider.js";
import {InvestmentIdea, QuoteDetails} from "../../models.js";

describe("ProviderRegistry & TradernetProvider", () => {
    let registry: ProviderRegistry;
    let tradernetProvider: TradernetProvider;

    beforeEach(() => {
        tradernetProvider = new TradernetProvider();
        registry = new ProviderRegistry([tradernetProvider]);
    });

    it("should format tradernet idea URL by stripping provider prefix", () => {
        const url = registry.getIdeaUrl("tradernet", "tradernet_11584");
        expect(url).toBe("https://freedom24.com/ideas/details/11584");
    });

    it("should format tradernet idea URL if ID does not have provider prefix", () => {
        const url = registry.getIdeaUrl("tradernet", "11584");
        expect(url).toBe("https://freedom24.com/ideas/details/11584");
    });

    it("should handle case-insensitive provider name", () => {
        const url = registry.getIdeaUrl("TRADERNET", "tradernet_9999");
        expect(url).toBe("https://freedom24.com/ideas/details/9999");
    });

    it("should return '#' for unknown providers", () => {
        const url = registry.getIdeaUrl("unknown_provider", "1234");
        expect(url).toBe("#");
    });

    it("should return '#' if provider or ideaId is missing", () => {
        expect(registry.getIdeaUrl(undefined, "1234")).toBe("#");
        expect(registry.getIdeaUrl("tradernet", undefined)).toBe("#");
    });

    it("should allow registering new custom providers dynamically", () => {
        class CustomProvider implements InvestmentProvider {
            readonly name = "custom_broker";

            getIdeaUrl(ideaId: string): string {
                return `https://custombroker.com/idea/${ideaId}`;
            }

            getLogoByTicker(ticker: string): string {
                return `https://custombroker.com/logo/${ticker}`;
            }

            async fetchIdeas(): Promise<InvestmentIdea[]> {
                return [];
            }

            async getDetails(): Promise<string | undefined> {
                return undefined;
            }

            async getQuoteDetails(): Promise<QuoteDetails[]> {
                return [];
            }
        }

        registry.register(new CustomProvider());
        expect(registry.getIdeaUrl("custom_broker", "42")).toBe("https://custombroker.com/idea/42");
    });
});
