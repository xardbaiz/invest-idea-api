import {jest} from "@jest/globals";
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

    describe("getPraamsStockInfoByTicker", () => {
        it("should fetch stock info and return correctly grouped risk/return scores and factors", async () => {
            const mockResponse = {
                generalData: {
                    scores: {
                        other: 1,
                        solvency: 2,
                        dividends: 1,
                        growthMom: 6,
                        liquidity: 2,
                        valuation: 2,
                        stressTest: 7,
                        volatility: 7,
                        analystView: 5,
                        countryRisk: 1,
                        performance: 3,
                        profitability: 7
                    },
                    keyFactors: {
                        risk: {
                            characteristic: "High",
                            factors: [{ text: "High volatility", priority: 1 }]
                        },
                        return: {
                            characteristic: "Average",
                            factors: [{ text: "Strong growth", priority: 1 }]
                        }
                    }
                }
            };

            const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            } as any);

            const result = await provider.getPraamsStockInfoByTicker("APP.US");

            expect(fetchSpy).toHaveBeenCalledWith(
                "https://tradernet.com/api?cmd=getPraamsStockInfoByTicker",
                expect.objectContaining({
                    method: "POST"
                })
            );

            expect(result).toEqual({
                risk: {
                    characteristic: "High",
                    scores: {
                        countryRisk: 1,
                        volatility: 7,
                        stressTest: 7,
                        liquidity: 2,
                        solvency: 2,
                        other: 1
                    },
                    factors: [{ text: "High volatility", priority: 1 }]
                },
                return: {
                    characteristic: "Average",
                    scores: {
                        dividends: 1,
                        growthMom: 6,
                        valuation: 2,
                        analystView: 5,
                        performance: 3,
                        profitability: 7
                    },
                    factors: [{ text: "Strong growth", priority: 1 }]
                }
            });

            fetchSpy.mockRestore();
        });
    });

    describe("getQuoteCardInfo", () => {
        it("should fetch quote card info with recommendations", async () => {
            const mockResponse = {
                recommendations: {
                    text: "As recommended by 34 major investment banks",
                    title: "Buy",
                    color: "green",
                    raw: 20,
                    items: [
                        { id: "BUY", title: "Strong Buy", color: "green", raw: 7 },
                        { id: "OUTPERFORM", title: "Buy", color: "lightgreen", raw: 20 },
                        { id: "HOLD", title: "Hold", color: "gray", raw: 7 }
                    ]
                }
            };

            const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            } as any);

            const result = await provider.getQuoteCardInfo("APP.US");

            expect(fetchSpy).toHaveBeenCalledWith(
                "https://tradernet.com/api?cmd=getQuoteCardInfo",
                expect.objectContaining({
                    method: "POST"
                })
            );

            expect(result).toEqual(mockResponse);

            fetchSpy.mockRestore();
        });
    });
});
