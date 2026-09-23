import { TradernetClient } from "../tradernet.js";

describe("TradernetClient", () => {
    let client: TradernetClient;

    beforeEach(() => {
        client = new TradernetClient();
    });

    it("should return lower cased logo URL for a ticker", () => {
        const logoUrl = client.getLogoByTicker("AAPL");
        expect(logoUrl).toBe("https://tradernet.com/logos/get-logo-by-ticker?ticker=aapl");
    });
});
