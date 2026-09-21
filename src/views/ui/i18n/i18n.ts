// @ts-ignore
import translations from "./translations.json";

export type Language = 'en' | 'ru';

export function getLanguageFromHeader(acceptLanguage?: string): Language {
    if (!acceptLanguage) return 'en';
    const primary = acceptLanguage.toLowerCase();
    if (primary.includes('ru')) return 'ru';
    return 'en';
}

export function getTranslations(lang: Language = 'en') {
    return (translations as Record<Language, any>)[lang] || translations.en;
}
