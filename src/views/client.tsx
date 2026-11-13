import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App.js';
import { LandingPage } from './ui/LandingPage.js';
import { Language } from './ui/i18n/i18n.js';

if (typeof window !== 'undefined') {
    const rootEl = document.getElementById('root');
    if (rootEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const queryLang = urlParams.get('lang') as Language;
        const docLang = document.documentElement.lang as Language;
        const navLang = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';

        const lang: Language = (queryLang === 'ru' || queryLang === 'en')
            ? queryLang
            : (docLang === 'ru' || docLang === 'en')
                ? docLang
                : navLang;

        const isLanding = window.location.pathname === '/' || window.location.pathname === '';

        if (isLanding) {
            createRoot(rootEl).render(<LandingPage lang={lang} />);
        } else {
            // Read initial props passed via dataset or parse URL parameters
            const query = urlParams.get('query') || '';
            const from = urlParams.get('from') || '';
            const to = urlParams.get('to') || '';
            const limit = Number(urlParams.get('limit')) || 10;

            createRoot(rootEl).render(
                <App
                    query={query}
                    from={from}
                    to={to}
                    limit={limit}
                    searched={!!query}
                    lang={lang}
                />
            );
        }
    }
}
