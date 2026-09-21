import fs from 'node:fs';
import path from 'node:path';

let translations: any;

try {
    const jsonPath = path.join(process.cwd(), 'src', 'views', 'ui', 'i18n', 'translations.json');
    if (fs.existsSync(jsonPath)) {
        translations = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
        const distJsonPath = path.join(process.cwd(), 'dist', 'views', 'ui', 'i18n', 'translations.json');
        translations = JSON.parse(fs.readFileSync(distJsonPath, 'utf8'));
    }
} catch (e) {
    translations = {};
}

export type Language = 'en' | 'ru';

export function getLanguageFromHeader(acceptLanguage?: string): Language {
    if (!acceptLanguage) return 'en';
    const primary = acceptLanguage.toLowerCase();
    if (primary.includes('ru')) return 'ru';
    return 'en';
}

export function getTranslations(lang: Language = 'en') {
    return (translations as Record<Language, any>)[lang] || translations.en || {};
}
