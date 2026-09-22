import fs from 'node:fs';
import path from 'node:path';

let translationsData: any = {};

try {
    const jsonPath = path.join(process.cwd(), 'src', 'views', 'ui', 'i18n', 'translations.json');
    if (fs.existsSync(jsonPath)) {
        translationsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
        const distJsonPath = path.join(process.cwd(), 'dist', 'views', 'ui', 'i18n', 'translations.json');
        if (fs.existsSync(distJsonPath)) {
            translationsData = JSON.parse(fs.readFileSync(distJsonPath, 'utf8'));
        }
    }
} catch (e) {
    translationsData = {};
}

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
