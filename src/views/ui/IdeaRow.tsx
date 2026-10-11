import React, { useState } from 'react';
import {
    Box,
    TableRow,
    TableCell,
    Typography,
    Link,
    Button,
    Chip,
    Avatar,
    Collapse,
    CircularProgress,
    Table,
    TableHead,
    TableBody
} from '@mui/material';
import { Language, getTranslations } from './i18n/i18n.js';
import { AnalyticsDiagrams } from './AnalyticsDiagrams.js';

export interface IdeaItem {
    id?: string;
    ticker?: string;
    companyName?: string;
    summary?: string;
    description?: string;
    digest?: Record<string, string>;
    targetPrice?: number | null;
    currentPrice?: number | null;
    url?: string | null;
    logoUrl?: string | null;
    publishDate?: string | null;
    similarity?: number | null;
}

interface IdeaRowProps {
    idea: IdeaItem;
    index: number;
    lang?: Language;
}

function formatInlineMarkdown(text: string): React.ReactNode {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <Box component="strong" key={index} sx={{ fontWeight: 700, color: '#111' }}>
                    {part.slice(2, -2)}
                </Box>
            );
        }
        return part;
    });
}

function renderMarkdownContent(content: string): React.ReactNode {
    if (!content) return null;
    const lines = content.split(/\r?\n/);
    const elements: React.ReactNode[] = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();

        // Check for markdown table start
        if (line.startsWith('|') && line.endsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
                tableLines.push(lines[i].trim());
                i++;
            }

            const dataRows = tableLines.filter(row => !/^\|[\s:-|-]+\|$/.test(row));
            if (dataRows.length > 0) {
                const headerRow = dataRows[0];
                const headerCols = headerRow.split('|').slice(1, -1).map(c => c.trim());
                const bodyRows = dataRows.slice(1).map(row => row.split('|').slice(1, -1).map(c => c.trim()));

                elements.push(
                    <Box key={`table-${i}`} sx={{ my: 1.5, overflowX: 'auto' }}>
                        <Table size="small" sx={{ minWidth: 300, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    {headerCols.map((col, idx) => (
                                        <TableCell key={idx} sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 0.75 }}>
                                            {formatInlineMarkdown(col)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bodyRows.map((row, rIdx) => (
                                    <TableRow key={rIdx}>
                                        {row.map((cell, cIdx) => (
                                            <TableCell key={cIdx} sx={{ fontSize: '0.8rem', py: 0.75 }}>
                                                {formatInlineMarkdown(cell)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                );
            }
            continue;
        }

        // Headers
        if (line.startsWith('### ')) {
            elements.push(
                <Typography key={`h3-${i}`} variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1.5, mb: 0.5, color: '#1a237e' }}>
                    {formatInlineMarkdown(line.substring(4))}
                </Typography>
            );
            i++;
            continue;
        }
        if (line.startsWith('## ')) {
            elements.push(
                <Typography key={`h2-${i}`} variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1.5, mb: 0.5, color: '#0d47a1' }}>
                    {formatInlineMarkdown(line.substring(3))}
                </Typography>
            );
            i++;
            continue;
        }
        if (line.startsWith('# ')) {
            elements.push(
                <Typography key={`h1-${i}`} variant="h6" sx={{ fontWeight: 'bold', mt: 1.5, mb: 0.5, color: '#0d47a1' }}>
                    {formatInlineMarkdown(line.substring(2))}
                </Typography>
            );
            i++;
            continue;
        }

        // Bullet points
        if (line.startsWith('- ') || line.startsWith('* ')) {
            const listText = line.substring(2);
            elements.push(
                <Box key={`list-${i}`} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, ml: 1, my: 0.25 }}>
                    <Box component="span" sx={{ color: '#1976d2', fontWeight: 'bold', lineHeight: '1.4' }}>•</Box>
                    <Typography variant="body2" component="span" sx={{ fontSize: '0.85rem', color: '#333' }}>
                        {formatInlineMarkdown(listText)}
                    </Typography>
                </Box>
            );
            i++;
            continue;
        }

        // Blank lines
        if (!line) {
            i++;
            continue;
        }

        // Regular paragraph
        elements.push(
            <Typography key={`p-${i}`} variant="body2" sx={{ fontSize: '0.85rem', color: '#333', my: 0.5 }}>
                {formatInlineMarkdown(line)}
            </Typography>
        );
        i++;
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column' }}>{elements}</Box>;
}

function formatSummaryText(text: string): React.ReactNode {
    if (!text) return text;
    const regex = /(Sector:|Business:|Idea:|Сектор:|Бизнес:|Идея:)/g;
    const parts = text.split(regex);
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
        if (part.match(regex)) {
            return (
                <Box component="strong" key={index} sx={{ fontWeight: 700, color: '#111' }}>
                    {part}
                </Box>
            );
        }
        return part;
    });
}

export function IdeaRow({ idea, index, lang = 'en' }: IdeaRowProps) {
    const t = getTranslations(lang);
    const rowId = `idea-${index}`;
    const descId = `desc-${index}`;
    const btnId = `btn-${index}`;

    const [isExpanded, setIsExpanded] = useState(false);
    const [showDiagrams, setShowDiagrams] = useState(false);
    const [analyticsStatus, setAnalyticsStatus] = useState<'idle' | 'success' | 'error' | 'nodata'>('idle');

    const initialDigest = idea.digest?.[lang];
    const [digestText, setDigestText] = useState<string | null>(initialDigest || null);
    const [digestLoading, setDigestLoading] = useState(false);
    const [digestError, setDigestError] = useState<string | null>(null);

    const handleFetchDigest = async () => {
        if (!idea.id) return;
        setDigestLoading(true);
        setDigestError(null);
        try {
            const res = await fetch(`/api/ideas/${idea.id}/digest?lang=${lang}`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            if (data.digest) {
                setDigestText(data.digest);
            } else {
                throw new Error('No digest returned');
            }
        } catch (e: any) {
            setDigestError(e.message || 'Failed to load digest');
        } finally {
            setDigestLoading(false);
        }
    };

    const text = idea.summary || idea.description || '';
    const isLong = text.length > 150;
    const shortText = isLong ? text.substring(0, 150) + '...' : text;

    const formattedDate = idea.publishDate
        ? new Date(idea.publishDate).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')
        : '—';
    const similarityPercent = idea.similarity !== null && idea.similarity !== undefined
        ? `${Math.round(idea.similarity * 100)}%`
        : '—';

    const isGreenPrice = idea.currentPrice != null && idea.targetPrice != null && idea.currentPrice < idea.targetPrice;
    const currentToTargetPercentage = isGreenPrice ? ((idea.targetPrice! - idea.currentPrice!) / idea.currentPrice! * 100).toFixed(1) : null;

    const subLabelSx = {
        fontSize: '0.68rem',
        color: '#777',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.04em',
        mb: '2px'
    };

    return (
        <React.Fragment>
            <TableRow id={rowId} sx={{ transition: 'background-color 0.15s' }}>
                {/* Group 1: Ticker, Company, Publish Date */}
                <TableCell sx={{ padding: '12px 10px 4px 10px', verticalAlign: 'top', borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Box>
                            <Typography sx={subLabelSx}>{t.thTicker}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {idea.logoUrl && (
                                    <Avatar
                                        src={idea.logoUrl}
                                        alt=""
                                        variant="rounded"
                                        sx={{
                                            width: 18,
                                            height: 18,
                                            bgcolor: '#f0f0f0',
                                            img: { objectFit: 'contain' }
                                        }}
                                    />
                                )}
                                {idea.url ? (
                                    <Link
                                        href={idea.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="none"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.95rem',
                                            color: '#1976d2',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}
                                    >
                                        {idea.ticker || '—'}
                                        <Box component="span" className="material-icons" sx={{ fontSize: '13px' }}>
                                            open_in_new
                                        </Box>
                                    </Link>
                                ) : (
                                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                                        {idea.ticker || '—'}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box>
                            <Typography sx={subLabelSx}>{t.thCompany}</Typography>
                            <Typography sx={{ fontWeight: 500, color: '#333', fontSize: '0.85rem' }}>
                                {idea.companyName || '—'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography sx={subLabelSx}>{t.thPublishDate}</Typography>
                            <Typography sx={{ color: '#666', fontSize: '0.82rem' }}>
                                {formattedDate}
                            </Typography>
                        </Box>
                    </Box>
                </TableCell>

                {/* Group 3: Current Price, Target Price, Relevance (Right-aligned) */}
                <TableCell align="right" sx={{ padding: '12px 10px 4px 10px', verticalAlign: 'top', borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={subLabelSx}>{t.thCurrentPrice}</Typography>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: isGreenPrice ? '#2e7d32' : '#333'
                                }}
                            >
                                {idea.currentPrice != null ? `$${idea.currentPrice.toFixed(2)}` : '—'}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={subLabelSx}>{t.thTargetPrice}</Typography>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: isGreenPrice ? '#2e7d32' : '#333'
                                }}
                            >
                                {idea.targetPrice != null ? `$${idea.targetPrice}${isGreenPrice ? ` (+${currentToTargetPercentage}%)` : ''}` : '—'}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={subLabelSx}>{t.thRelevance}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Chip
                                    label={similarityPercent}
                                    size="small"
                                    sx={{
                                        height: '22px',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        backgroundColor: idea.similarity && idea.similarity > 0.7 ? '#e8f5e9' : '#f5f5f5',
                                        color: idea.similarity && idea.similarity > 0.7 ? '#2e7d32' : '#616161',
                                        border: `1px solid ${idea.similarity && idea.similarity > 0.7 ? '#c8e6c9' : '#e0e0e0'}`
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </TableCell>

                {/* Column 3: Analytics Diagram Button or Error / No Data Message */}
                <TableCell align="center" sx={{ padding: '12px 10px 4px 10px', verticalAlign: 'top', borderBottom: 'none' }}>
                    {analyticsStatus === 'error' ? (
                        <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600, display: 'block', py: 0.75 }}>
                            {t.analyticsError || 'Error loading analytics'}
                        </Typography>
                    ) : analyticsStatus === 'nodata' ? (
                        <Typography variant="caption" sx={{ color: '#888888', fontWeight: 500, display: 'block', py: 0.75 }}>
                            {t.analyticsNoData || 'Analytics data unavailable'}
                        </Typography>
                    ) : (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowDiagrams(!showDiagrams)}
                            startIcon={
                                <Box component="span" className="material-icons" sx={{ fontSize: '18px' }}>
                                    pie_chart
                                </Box>
                            }
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 1.5,
                                py: 0.75,
                                borderColor: showDiagrams ? '#1976d2' : '#cccccc',
                                color: showDiagrams ? '#1976d2' : '#555555',
                                backgroundColor: showDiagrams ? '#e3f2fd' : 'transparent',
                                '&:hover': {
                                    backgroundColor: showDiagrams ? '#bbdefb' : '#f5f5f5',
                                    borderColor: '#1976d2'
                                }
                            }}
                        >
                            {showDiagrams ? (t.btnHideDiagrams || 'Hide Diagrams') : (t.btnAnalyticsDiagrams || 'Show Analytics Diagrams')}
                        </Button>
                    )}
                </TableCell>
            </TableRow>

            {/* Asynchronous Analytics Diagrams Row */}
            {showDiagrams && analyticsStatus !== 'error' && analyticsStatus !== 'nodata' && (
                <TableRow>
                    <TableCell colSpan={3} sx={{ p: 0, borderBottom: 'none' }}>
                        <Collapse in={showDiagrams} timeout="auto" unmountOnExit>
                            <AnalyticsDiagrams
                                ticker={idea.ticker}
                                onDataLoaded={(status) => {
                                    setAnalyticsStatus(status);
                                    if (status === 'error' || status === 'nodata') {
                                        setShowDiagrams(false);
                                    }
                                }}
                            />
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}

            {/* Summary / Digest Row spanning full width underneath */}
            <TableRow sx={{ borderBottom: '1px solid #eee', transition: 'background-color 0.15s' }}>
                <TableCell
                    colSpan={3}
                    sx={{
                        padding: '4px 10px 12px 10px',
                        verticalAlign: 'top',
                        lineHeight: '1.45',
                        color: '#444'
                    }}
                >
                    {digestText ? (
                        <Box sx={{ my: 1, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e3f2fd' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1565c0', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box component="span" className="material-icons" sx={{ fontSize: '18px' }}>
                                        auto_awesome
                                    </Box>
                                    {t.digestTitle || 'AI Digest'}
                                </Typography>
                            </Box>
                            {renderMarkdownContent(digestText)}
                        </Box>
                    ) : (
                        <React.Fragment>
                            <Box sx={{ whiteSpace: 'pre-line' }}>
                                {isLong ? (
                                    <Box>
                                        <Box component="span" id={`${descId}-short`} sx={{ display: isExpanded ? 'none' : 'inline' }}>
                                            {formatSummaryText(shortText)}{' '}
                                        </Box>
                                        <Box component="span" id={`${descId}-full`} sx={{ display: isExpanded ? 'inline' : 'none' }}>
                                            {formatSummaryText(text)}{' '}
                                        </Box>
                                        <Button
                                            id={btnId}
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            variant="text"
                                            sx={{
                                                minWidth: 'auto',
                                                p: 0,
                                                color: '#1976d2',
                                                fontWeight: 'bold',
                                                fontSize: '0.82rem',
                                                textTransform: 'none',
                                                textDecoration: 'underline',
                                                verticalAlign: 'baseline',
                                                '&:hover': {
                                                    background: 'none',
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {isExpanded ? t.btnCollapse : t.btnExpand}
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box component="span">{formatSummaryText(text) || '—'}</Box>
                                )}
                            </Box>

                            {idea.id && (
                                <Box sx={{ mt: 1 }}>
                                    {digestLoading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                            <CircularProgress size={18} />
                                            <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                {t.btnDigestLoading || 'Generating AI Digest...'}
                                            </Typography>
                                        </Box>
                                    ) : digestError ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                                                {t.btnDigestError || 'Error loading digest. Click to retry.'}
                                            </Typography>
                                            <Button size="small" variant="text" onClick={handleFetchDigest} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                                                Retry
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleFetchDigest}
                                            startIcon={
                                                <Box component="span" className="material-icons" sx={{ fontSize: '16px' }}>
                                                    auto_awesome
                                                </Box>
                                            }
                                            sx={{
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                px: 1.5,
                                                py: 0.5,
                                                borderColor: '#90caf9',
                                                color: '#1565c0',
                                                backgroundColor: '#f4f8fb',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                    borderColor: '#1976d2',
                                                }
                                            }}
                                        >
                                            {t.btnRequestDigest || 'Request AI Idea Digest'}
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </React.Fragment>
                    )}
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
