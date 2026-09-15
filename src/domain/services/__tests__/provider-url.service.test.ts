import {ProviderUrlService} from "../provider-url.service.js";

describe("ProviderUrlService", () => {
    let service: ProviderUrlService;

    beforeEach(() => {
        service = new ProviderUrlService();
    });

    it("should format tradernet idea URL by stripping provider prefix", () => {
        const url = service.getIdeaUrl("tradernet", "tradernet_11584");
        expect(url).toBe("https://freedom24.com/ideas/details/11584");
    });

    it("should format tradernet idea URL if ID does not have provider prefix", () => {
        const url = service.getIdeaUrl("tradernet", "11584");
        expect(url).toBe("https://freedom24.com/ideas/details/11584");
    });

    it("should handle case-insensitive provider name", () => {
        const url = service.getIdeaUrl("TRADERNET", "tradernet_9999");
        expect(url).toBe("https://freedom24.com/ideas/details/9999");
    });

    it("should return '#' for unknown providers", () => {
        const url = service.getIdeaUrl("unknown_provider", "1234");
        expect(url).toBe("#");
    });

    it("should return '#' if provider or ideaId is missing", () => {
        expect(service.getIdeaUrl(undefined, "1234")).toBe("#");
        expect(service.getIdeaUrl("tradernet", undefined)).toBe("#");
    });

    it("should allow custom base URLs via constructor", () => {
        const customService = new ProviderUrlService({
            custom_broker: "https://example.com/ideas/",
        });
        expect(customService.getIdeaUrl("custom_broker", "custom_broker_42")).toBe("https://example.com/ideas/42");
    });
});
