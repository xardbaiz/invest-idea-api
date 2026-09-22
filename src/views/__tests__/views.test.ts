import {getLanguageFromHeader} from "../ui/i18n/i18n.js";

describe("Views and Localization Tests", () => {
    describe("Language detection from Accept-Language header", () => {
        it("should return 'en' when header is missing or empty", () => {
            expect(getLanguageFromHeader(undefined)).toBe("en");
            expect(getLanguageFromHeader("")).toBe("en");
            expect(getLanguageFromHeader("fr-FR,fr;q=0.9")).toBe("en");
        });

        it("should return 'ru' when 'ru' is present in Accept-Language", () => {
            expect(getLanguageFromHeader("ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("ru");
            expect(getLanguageFromHeader("en-US,en;q=0.9,ru;q=0.8")).toBe("ru");
        });
    });
});
