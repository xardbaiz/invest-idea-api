import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemButton,
    ClickAwayListener,
    Typography,
    Avatar,
    CircularProgress
} from '@mui/material';
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
        <Paper
            elevation={1}
            sx={{
                p: { xs: 2.5, sm: 3 },
                mb: 4,
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
        >
            <form id="searchForm" method="GET" action="/ideas" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                id="query"
                                name="query"
                                label={t.searchLabelQuery}
                                placeholder={t.searchPlaceholderQuery}
                                value={query}
                                onChange={handleQueryChange}
                                onFocus={() => {
                                    if (suggestions.length > 0) setShowDropdown(true);
                                }}
                                fullWidth
                                variant="outlined"
                                slotProps={{
                                    htmlInput: { autoComplete: 'off' }
                                }}
                            />

                            {showDropdown && suggestions.length > 0 && (
                                <Paper
                                    elevation={3}
                                    sx={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        zIndex: 1000,
                                        mt: 0.5,
                                        maxHeight: 240,
                                        overflowY: 'auto',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}
                                >
                                    <List disablePadding>
                                        {suggestions.map((company, index) => (
                                            <ListItem disablePadding key={index}>
                                                <ListItemButton
                                                    onClick={() => handleCompanyClick(company)}
                                                    sx={{ py: 1.25, px: 2, gap: 1.5 }}
                                                >
                                                    {company.logoUrl && (
                                                        <Avatar
                                                            src={company.logoUrl}
                                                            alt=""
                                                            variant="rounded"
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: '#f0f0f0',
                                                                img: { objectFit: 'contain' }
                                                            }}
                                                        />
                                                    )}
                                                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                                                        <Box
                                                            component="span"
                                                            sx={{ fontWeight: 600, color: '#1976d2' }}
                                                        >
                                                            {company.ticker}
                                                        </Box>
                                                        {company.companyName && (
                                                            <Box
                                                                component="span"
                                                                sx={{ color: '#555', ml: 1 }}
                                                            >
                                                                — {company.companyName}
                                                            </Box>
                                                        )}
                                                    </Typography>
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                    </ClickAwayListener>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                        <TextField
                            id="from"
                            name="from"
                            label={t.searchLabelFrom}
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            fullWidth
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        />
                        <TextField
                            id="to"
                            name="to"
                            label={t.searchLabelTo}
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            fullWidth
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                        />
                        <TextField
                            id="limit"
                            name="limit"
                            label={t.searchLabelLimit}
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            fullWidth
                            slotProps={{
                                htmlInput: { min: 1, max: 100 }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                            type="submit"
                            id="submitBtn"
                            variant="contained"
                            disabled={loading}
                            size="large"
                            startIcon={
                                loading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <Box component="span" className="material-icons" sx={{ fontSize: 20 }}>
                                        search
                                    </Box>
                                )
                            }
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3.5,
                                py: 1.25,
                                borderRadius: '8px',
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            {loading ? '...' : t.searchBtn}
                        </Button>
                    </Box>
                </Box>
            </form>
        </Paper>
    );
}
