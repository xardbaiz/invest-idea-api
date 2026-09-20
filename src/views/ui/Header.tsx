import { Language, getTranslations } from './i18n/translations.js';

interface HeaderProps {
    lang?: Language;
}

export function Header({ lang = 'en' }: HeaderProps) {
    const t = getTranslations(lang);
    return (
        <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 500, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1a1a1a' }}>
                <span className="material-icons" style={{ fontSize: '36px', color: '#1976d2' }}>lightbulb</span>
                {t.ideasPageTitle}
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
                {t.ideasPageSubtitle}
            </p>
        </div>
    );
}
