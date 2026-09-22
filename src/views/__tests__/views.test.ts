import {renderLandingPage} from "../landing-page.js";
import {renderIdeasPage} from "../ideas-page.js";
import {getLanguageFromHeader} from "../ui/i18n/i18n.js";
import {initIdeaToggle, toggleIdea} from "../ui/ideas-client.js";

describe("Views SSR and Localization Tests", () => {
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

    describe("renderLandingPage tests", () => {
        it("should render English landing page by default", () => {
            const html = renderLandingPage({ lang: "en" });
            expect(html).toContain('<!DOCTYPE html>');
            expect(html).toContain('lang="en"');
            expect(html).toContain('Search Investment Ideas from Broker Reports');
            expect(html).not.toContain('<[object Object]>');
        });

        it("should render Russian landing page when lang is 'ru'", () => {
            const html = renderLandingPage({ lang: "ru" });
            expect(html).toContain('<!DOCTYPE html>');
            expect(html).toContain('lang="ru"');
            expect(html).toContain('Поиск инвестиционных идей из отчетов и обзоров');
            expect(html).not.toContain('<[object Object]>');
        });
    });

    describe("renderIdeasPage tests", () => {
        it("should render English search page", () => {
            const html = renderIdeasPage({ query: "AI", lang: "en" });
            expect(html).toContain('<!DOCTYPE html>');
            expect(html).toContain('lang="en"');
            expect(html).toContain('Search Investment Ideas');
            expect(html).toContain('value="AI"');
            expect(html).toContain('<script type="module" src="/js/ideas-client.js"></script>');
            expect(html).not.toContain('<[object Object]>');
        });

        it("should render Russian search page and display idea details", () => {
            const mockIdeas = [
                {
                    ticker: "NVDA",
                    companyName: "NVIDIA Corp",
                    summary: "Strong growth driven by AI chips",
                    currentPrice: 120.5,
                    targetPrice: 150.0,
                    similarity: 0.85,
                    publishDate: "2025-01-15T00:00:00.000Z",
                    url: "https://freedom24.com/ideas/details/12345"
                }
            ];

            const html = renderIdeasPage({ query: "чипы", ideas: mockIdeas, searched: true, lang: "ru" });
            expect(html).toContain('<!DOCTYPE html>');
            expect(html).toContain('lang="ru"');
            expect(html).toContain('Поиск инвестиционных идей');
            expect(html).toContain('NVDA');
            expect(html).toContain('NVIDIA Corp');
            expect(html).toContain('Strong growth driven by AI chips');
            expect(html).not.toContain('<[object Object]>');
        });
    });

    describe("ideas-client toggle script tests", () => {
        let elements: Map<string, any>;
        let listeners: Map<string, Function[]>;

        beforeEach(() => {
            elements = new Map();
            listeners = new Map();

            (global as any).window = {};
            (global as any).document = {
                readyState: 'complete',
                addEventListener: (event: string, fn: Function) => {
                    if (!listeners.has(event)) listeners.set(event, []);
                    listeners.get(event)!.push(fn);
                },
                getElementById: (id: string) => elements.get(id) || null,
            };
        });

        afterEach(() => {
            delete (global as any).document;
            delete (global as any).window;
        });

        it("should toggle short and full text visibility via toggleIdea function", () => {
            const btn = {
                id: 'btn-0',
                innerText: 'Expand',
                getAttribute: (attr: string) => {
                    if (attr === 'data-toggle-btn') return '';
                    if (attr === 'data-desc-id') return 'desc-0';
                    if (attr === 'data-expand-text') return 'Expand';
                    if (attr === 'data-collapse-text') return 'Collapse';
                    return null;
                },
                closest: (selector: string) => (selector === '[data-toggle-btn]' ? btn : null),
            };

            const shortEl = { style: { display: 'inline' } };
            const fullEl = { style: { display: 'none' } };

            elements.set('btn-0', btn);
            elements.set('desc-0-short', shortEl);
            elements.set('desc-0-full', fullEl);

            initIdeaToggle();

            // Toggle expand
            toggleIdea('desc-0', btn as any);
            expect(fullEl.style.display).toBe('inline');
            expect(shortEl.style.display).toBe('none');
            expect(btn.innerText).toBe('Collapse');

            // Toggle collapse
            toggleIdea('desc-0', btn as any);
            expect(fullEl.style.display).toBe('none');
            expect(shortEl.style.display).toBe('inline');
            expect(btn.innerText).toBe('Expand');
        });

        it("should work with Russian translation text for toggle button", () => {
            const btn = {
                id: 'btn-0',
                innerText: 'Развернуть',
                getAttribute: (attr: string) => {
                    if (attr === 'data-toggle-btn') return '';
                    if (attr === 'data-desc-id') return 'desc-0';
                    if (attr === 'data-expand-text') return 'Развернуть';
                    if (attr === 'data-collapse-text') return 'Свернуть';
                    return null;
                },
                closest: (selector: string) => (selector === '[data-toggle-btn]' ? btn : null),
            };

            const shortEl = { style: { display: 'inline' } };
            const fullEl = { style: { display: 'none' } };

            elements.set('btn-0', btn);
            elements.set('desc-0-short', shortEl);
            elements.set('desc-0-full', fullEl);

            initIdeaToggle();

            toggleIdea('desc-0', btn as any);
            expect(fullEl.style.display).toBe('inline');
            expect(shortEl.style.display).toBe('none');
            expect(btn.innerText).toBe('Свернуть');

            toggleIdea('desc-0', btn as any);
            expect(fullEl.style.display).toBe('none');
            expect(shortEl.style.display).toBe('inline');
            expect(btn.innerText).toBe('Развернуть');
        });
    });
});
