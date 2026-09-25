import React, { useState, useEffect, useRef } from 'react';
import { Language, getTranslations } from './i18n/i18n.js';

export interface CompanyEntry {
    ticker: string;
    companyName: string;
    logoUrl?: string;
}

export function getDefaultToDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getDefaultFromDate(): string {
    const now = new Date();
    const dateTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const year = dateTwoMonthsAgo.getFullYear();
    const month = String(dateTwoMonthsAgo.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
}

interface SearchFormProps {
    query: string;
    from: string;
    to: string;
    limit: number;
    lang?: Language;
    onSearch: (params: { query: string; from: string; to: string; limit: number }) => void;
    onSelectCompany?: (company: CompanyEntry) => void;
    loading?: boolean;
}

export function SearchForm({
    query: initialQuery = '',
    from: initialFrom = '',
    to: initialTo = '',
    limit: initialLimit = 10,
    lang = 'en',
    onSearch,
    onSelectCompany,
    loading = false
}: SearchFormProps) {
    const t = getTranslations(lang);

    const defaultFrom = getDefaultFromDate();
    const defaultTo = getDefaultToDate();

    const [query, setQuery] = useState(initialQuery);
    const [from, setFrom] = useState(initialFrom || defaultFrom);
    const [to, setTo] = useState(initialTo || defaultTo);
    const [limit, setLimit] = useState(initialLimit);

    const [suggestions, setSuggestions] = useState<CompanyEntry[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        setFrom(initialFrom || defaultFrom);
    }, [initialFrom, defaultFrom]);

    useEffect(() => {
        setTo(initialTo || defaultTo);
    }, [initialTo, defaultTo]);

    useEffect(() => {
        setLimit(initialLimit);
    }, [initialLimit]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (val.trim().length > 0) {
            fetch(`/api/companies?query=${encodeURIComponent(val)}`)
                .then((res) => (res.ok ? res.json() : []))
                .then((data: CompanyEntry[]) => {
                    setSuggestions(data);
                    setShowDropdown(data.length > 0);
                })
                .catch(() => {
                    setSuggestions([]);
                    setShowDropdown(false);
                });
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    const handleCompanyClick = (company: CompanyEntry) => {
        const displayVal = company.ticker || company.companyName;
        setQuery(displayVal);
        setShowDropdown(false);
        if (onSelectCompany) {
            onSelectCompany(company);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDropdown(false);
        onSearch({ query, from, to, limit });
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '32px',
            border: '1px solid #e0e0e0'
        }}>
            <form id="searchForm" method="GET" action="/ideas" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div ref={containerRef} style={{ position: 'relative' }}>
                        <label htmlFor="query" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                            {t.searchLabelQuery}
                        </label>
                        <input
                            type="text"
                            name="query"
                            id="query"
                            value={query}
                            onChange={handleQueryChange}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowDropdown(true);
                            }}
                            placeholder={t.searchPlaceholderQuery}
                            autoComplete="off"
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

                        {showDropdown && suggestions.length > 0 && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 1000,
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                marginTop: '4px',
                                listStyle: 'none',
                                padding: '8px 0',
                                margin: 0,
                                maxHeight: '240px',
                                overflowY: 'auto'
                            }}>
                                {suggestions.map((company, index) => {
                                    return (
                                        <li
                                            key={index}
                                            onClick={() => handleCompanyClick(company)}
                                            style={{
                                                padding: '10px 16px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                transition: 'background-color 0.15s'
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                                            }}
                                        >
                                            {company.logoUrl && (
                                                <img
                                                    src={company.logoUrl}
                                                    alt=""
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        objectFit: 'contain',
                                                        borderRadius: '3px',
                                                        backgroundColor: '#f0f0f0',
                                                        flexShrink: 0
                                                    }}
                                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                                />
                                            )}
                                            <div style={{ fontSize: '0.95rem' }}>
                                                <span style={{ fontWeight: 600, color: '#1976d2' }}>{company.ticker}</span>
                                                {company.companyName && (
                                                    <span style={{ color: '#555', marginLeft: '8px' }}>— {company.companyName}</span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
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
                                onChange={(e) => setFrom(e.target.value)}
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
                                onChange={(e) => setTo(e.target.value)}
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
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
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
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? '#90caf9' : '#1976d2',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 28px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 4px rgba(25,118,210,0.3)'
                            }}
                        >
                            <span className="material-icons" style={{ fontSize: '20px' }}>search</span>
                            {loading ? '...' : t.searchBtn}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
