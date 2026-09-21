import { Language, getTranslations } from './i18n/i18n.js';
import { Header } from './Header.js';
import { SearchForm } from './SearchForm.js';
import { IdeasTable } from './IdeasTable.js';
import { IdeaItem } from './IdeaRow.js';

interface AppProps {
    query?: string;
    from?: string;
    to?: string;
    limit?: number;
    ideas?: IdeaItem[];
    searched?: boolean;
    lang?: Language;
}

export function App({ query, from, to, limit, ideas = [], searched = false, lang = 'en' }: AppProps) {
    const t = getTranslations(lang);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', fontFamily: 'Roboto, Arial, sans-serif' }}>
            <div style={{ marginBottom: '16px' }}>
                <a href="/" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
                    {t.navHome}
                </a>
            </div>
            <Header lang={lang} />
            <SearchForm query={query} from={from} to={to} limit={limit} lang={lang} />
            <IdeasTable ideas={ideas} searched={searched} lang={lang} />
        </div>
    );
}
