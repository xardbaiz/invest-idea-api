import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './Header.js';
import { SearchForm, CompanyEntry, getDefaultFromDate, getDefaultToDate } from './SearchForm.js';
import { IdeasTable } from './IdeasTable.js';
import { IdeaItem } from './IdeaRow.js';
import { Language, getTranslations } from './i18n/i18n.js';

interface AppProps {
    query?: string;
    from?: string;
    to?: string;
    limit?: number;
    ideas?: IdeaItem[];
    searched?: boolean;
    lang?: Language;
}

export function App({
    query: initialQuery = '',
    from: initialFrom = '',
    to: initialTo = '',
    limit: initialLimit = 10,
    ideas: initialIdeas = [],
    searched: initialSearched = false,
    lang = 'en'
}: AppProps) {
    const t = getTranslations(lang);

    const defaultFrom = getDefaultFromDate();
    const defaultTo = getDefaultToDate();

    const [query, setQuery] = useState(initialQuery);
    const [from, setFrom] = useState(initialFrom || defaultFrom);
    const [to, setTo] = useState(initialTo || defaultTo);
    const [limit, setLimit] = useState(initialLimit);
    const [ideas, setIdeas] = useState<IdeaItem[]>(initialIdeas);
    const [searched, setSearched] = useState(initialSearched);
    const [loading, setLoading] = useState(false);

    const fetchIdeas = useCallback(async (searchParams: { query: string; from: string; to: string; limit: number }) => {
        if (!searchParams.query) return;
        setLoading(true);
        setSearched(true);
        try {
            const url = `/api/ideas?query=${encodeURIComponent(searchParams.query)}&from=${encodeURIComponent(searchParams.from)}&to=${encodeURIComponent(searchParams.to)}&limit=${searchParams.limit}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setIdeas(data);
            } else {
                console.error('Failed to fetch ideas:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialQuery && initialIdeas.length === 0) {
            fetchIdeas({
                query: initialQuery,
                from: initialFrom || defaultFrom,
                to: initialTo || defaultTo,
                limit: initialLimit
            });
        }
    }, [initialQuery, initialFrom, initialTo, initialLimit, initialIdeas.length, defaultFrom, defaultTo, fetchIdeas]);

    const handleSearch = (params: { query: string; from: string; to: string; limit: number }) => {
        setQuery(params.query);
        setFrom(params.from);
        setTo(params.to);
        setLimit(params.limit);

        if (typeof window !== 'undefined' && window.history) {
            const url = new URL(window.location.href);
            url.searchParams.set('query', params.query);
            url.searchParams.set('from', params.from);
            url.searchParams.set('to', params.to);
            url.searchParams.set('limit', String(params.limit));
            window.history.pushState({}, '', url.toString());
        }

        fetchIdeas(params);
    };

    const handleSelectCompany = async (company: CompanyEntry) => {
        const selectedQuery = company.ticker || company.companyName;
        setQuery(selectedQuery);
        setLoading(true);
        setSearched(true);

        if (typeof window !== 'undefined' && window.history) {
            const url = new URL(window.location.href);
            url.searchParams.set('company', selectedQuery);
            url.searchParams.set('query', selectedQuery);
            window.history.pushState({}, '', url.toString());
        }

        try {
            const url = `/api/companies/ideas?company=${encodeURIComponent(selectedQuery)}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setIdeas(data);
            } else {
                console.error('Failed to fetch company ideas:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching company ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 8px', fontFamily: 'Roboto, Arial, sans-serif', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '16px' }}>
                <a href="/" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
                    {t.navHome}
                </a>
            </div>

            <Header lang={lang} />

            <SearchForm
                query={query}
                from={from}
                to={to}
                limit={limit}
                lang={lang}
                onSearch={handleSearch}
                onSelectCompany={handleSelectCompany}
                loading={loading}
            />

            <IdeasTable
                ideas={ideas}
                searched={searched}
                loading={loading}
                lang={lang}
            />
        </div>
    );
}
