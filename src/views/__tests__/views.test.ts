import {getLanguageFromHeader, getTranslations} from "../ui/i18n/i18n.js";

describe("Views and Localization Tests", () => {
    describe("Translations completeness", () => {
        it("should contain updated About section feature keys for EN and RU", () => {
            const en = getTranslations("en");
            const ru = getTranslations("ru");

            expect(en.aboutFeat1Title).toBeDefined();
            expect(en.aboutFeat2Title).toBe("Targets & Upsides Active Now");
            expect(en.aboutFeat3Title).toBe("Analytics Diagrams & AI Digest");
            expect(en.aboutFeat4Title).toBe("P/E & Multipliers (Coming Soon)");

            expect(ru.aboutFeat1Title).toBeDefined();
            expect(ru.aboutFeat2Title).toBe("Таргеты и апсайды сейчас");
            expect(ru.aboutFeat3Title).toBe("Диаграммы Risk/Return и AI-дайджест");
            expect(ru.aboutFeat4Title).toBe("P/E и мультипликаторы (В разработке)");
        });
    });

    describe("Language detection from Accept-Language header", () => {
        it("should return 'en' when header is missing or empty", () => {
            expect(getLanguageFromHeader(undefined)).toBe("en");
            expect(getLanguageFromHeader("")).toBe("en");
            expect(getLanguageFromHeader("fr-FR,fr;q=0.9")).toBe("en");
        });

        it("should return 'ru' when 'ru' is present in Accept-Language", () => {
            expect(getLanguageFromHeader("ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("ru");
            expect(getLanguageFromHeader("en-US,en;q=0.9,ru;q=0.8")).toBe("ru");
            expect(getLanguageFromHeader("ru")).toBe("ru");
        });
    });

    describe("HTML lang attribute replacement", () => {
        it("should dynamically replace lang attribute in index.html content", () => {
            const templateHtml = '<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body><div id="root"></div></body></html>';
            const lang = getLanguageFromHeader("ru-RU");
            const localizedHtml = templateHtml.replace(/lang="[a-zA-Z-]+"/, `lang="${lang}"`);
            expect(localizedHtml).toContain('<html lang="ru">');
        });

        it("should preserve 'en' when language is English", () => {
            const templateHtml = '<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body><div id="root"></div></body></html>';
            const lang = getLanguageFromHeader("en-US");
            const localizedHtml = templateHtml.replace(/lang="[a-zA-Z-]+"/, `lang="${lang}"`);
            expect(localizedHtml).toContain('<html lang="en">');
        });
    });
});
