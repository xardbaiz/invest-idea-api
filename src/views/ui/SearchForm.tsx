import { Language, getTranslations } from './i18n/translations.js';

interface SearchFormProps {
    query?: string;
    from?: string;
    to?: string;
    limit?: number;
    lang?: Language;
}

export function SearchForm({ query = '', from = '', to = '', limit = 10, lang = 'en' }: SearchFormProps) {
    const t = getTranslations(lang);
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '32px',
            border: '1px solid #e0e0e0'
        }}>
            <form id="searchForm" method="GET" action="/ideas">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label htmlFor="query" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                            {t.searchLabelQuery}
                        </label>
                        <input
                            type="text"
                            name="query"
                            id="query"
                            value={query}
                            placeholder={t.searchPlaceholderQuery}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        <div>
                            <label htmlFor="from" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                                {t.searchLabelFrom}
                            </label>
                            <input
                                type="date"
                                name="from"
                                id="from"
                                value={from}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    fontSize: '0.95rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="to" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                                {t.searchLabelTo}
                            </label>
                            <input
                                type="date"
                                name="to"
                                id="to"
                                value={to}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    fontSize: '0.95rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="limit" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                                {t.searchLabelLimit}
                            </label>
                            <input
                                type="number"
                                name="limit"
                                id="limit"
                                value={String(limit)}
                                min="1"
                                max="100"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    fontSize: '0.95rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                            type="submit"
                            id="submitBtn"
                            style={{
                                backgroundColor: '#1976d2',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 28px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 4px rgba(25,118,210,0.3)'
                            }}
                        >
                            <span className="material-icons" style={{ fontSize: '20px' }}>search</span>
                            {t.searchBtn}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
