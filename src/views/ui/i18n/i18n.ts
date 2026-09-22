import translationsData from './translations.json' with { type: 'json' };

export type Language = 'en' | 'ru';

export function getLanguageFromHeader(acceptLanguage?: string): Language {
    if (!acceptLanguage) return 'en';
    const primary = acceptLanguage.toLowerCase();
    if (primary.includes('ru')) return 'ru';
    return 'en';
}

export function getTranslations(lang: Language = 'en') {
    return (translationsData as Record<Language, any>)[lang] || translationsData.en || {};
}
