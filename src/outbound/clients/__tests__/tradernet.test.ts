import {TradernetClient, TradernetProvider} from "../tradernet.js";

describe("TradernetProvider", () => {
    let provider: TradernetProvider;

    beforeEach(() => {
        provider = new TradernetProvider();
    });

    it("should have provider name as tradernet", () => {
        expect(provider.name).toBe("tradernet");
    });

    it("should return lower cased logo URL for a ticker", () => {
        const logoUrl = provider.getLogoByTicker("AAPL");
        expect(logoUrl).toBe("https://tradernet.com/logos/get-logo-by-ticker?ticker=aapl");
    });

    it("should format idea URL correctly", () => {
        expect(provider.getIdeaUrl("tradernet_12345")).toBe("https://freedom24.com/ideas/details/12345");
        expect(provider.getIdeaUrl("12345")).toBe("https://freedom24.com/ideas/details/12345");
        expect(provider.getIdeaUrl("")).toBe("#");
    });

    it("should export TradernetClient as alias to TradernetProvider", () => {
        const client = new TradernetClient();
        expect(client.name).toBe("tradernet");
    });
});
