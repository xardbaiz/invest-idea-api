import React, { useState } from 'react';
import { Language, getTranslations } from './i18n/i18n.js';

export interface IdeaItem {
    ticker?: string;
    companyName?: string;
    summary?: string;
    description?: string;
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

function formatSummaryText(text: string): React.ReactNode {
    if (!text) return text;
    const regex = /(Sector:|Business:|Idea:|Сектор:|Бизнес:|Идея:)/g;
    const parts = text.split(regex);
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
        if (part.match(regex)) {
            return <strong key={index} style={{ fontWeight: 700, color: '#111' }}>{part}</strong>;
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

    const subLabelStyle: React.CSSProperties = {
        fontSize: '0.7rem',
        color: '#777',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.04em',
        marginBottom: '2px'
    };

    return (
        <tr id={rowId} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.15s' }}>
            {/* Group 1: Ticker, Company, Publish Date */}
            <td style={{ padding: '16px', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <div style={subLabelStyle}>{t.thTicker}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {idea.logoUrl && (
                                <img
                                    src={idea.logoUrl}
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
                            {idea.url ? (
                                <a
                                    href={idea.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        color: '#1976d2',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {idea.ticker || '—'}
                                    <span className="material-icons" style={{ fontSize: '14px' }}>open_in_new</span>
                                </a>
                            ) : (
                                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{idea.ticker || '—'}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <div style={subLabelStyle}>{t.thCompany}</div>
                        <div style={{ fontWeight: 500, color: '#333', fontSize: '0.9rem' }}>
                            {idea.companyName || '—'}
                        </div>
                    </div>

                    <div>
                        <div style={subLabelStyle}>{t.thPublishDate}</div>
                        <div style={{ color: '#666', fontSize: '0.85rem' }}>
                            {formattedDate}
                        </div>
                    </div>
                </div>
            </td>

            {/* Group 2: Summary */}
            <td style={{ padding: '16px', verticalAlign: 'top', lineHeight: '1.5', color: '#444', whiteSpace: 'pre-line' }}>
                {isLong ? (
                    <div>
                        <span id={`${descId}-short`} style={{ display: isExpanded ? 'none' : 'inline' }}>
                            {formatSummaryText(shortText)}{' '}
                        </span>
                        <span id={`${descId}-full`} style={{ display: isExpanded ? 'inline' : 'none' }}>
                            {formatSummaryText(text)}{' '}
                        </span>
                        <button
                            type="button"
                            id={btnId}
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1976d2',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                padding: 0,
                                fontSize: '0.85rem',
                                textDecoration: 'underline'
                            }}
                        >
                            {isExpanded ? t.btnCollapse : t.btnExpand}
                        </button>
                    </div>
                ) : (
                    <span>{formatSummaryText(text) || '—'}</span>
                )}
            </td>

            {/* Group 3: Current Price, Target Price, Relevance */}
            <td style={{ padding: '16px', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <div style={subLabelStyle}>{t.thCurrentPrice}</div>
                        <div style={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: isGreenPrice ? '#2e7d32' : '#333'
                        }}>
                            {idea.currentPrice != null ? `$${idea.currentPrice.toFixed(2)}` : '—'}
                        </div>
                    </div>

                    <div>
                        <div style={subLabelStyle}>{t.thTargetPrice}</div>
                        <div style={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: isGreenPrice ? '#2e7d32' : '#333'
                        }}>
                            {idea.targetPrice != null ? `$${idea.targetPrice}${isGreenPrice ? ` (+${currentToTargetPercentage}%)` : ''}` : '—'}
                        </div>
                    </div>

                    <div>
                        <div style={subLabelStyle}>{t.thRelevance}</div>
                        <div>
                            <span style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                backgroundColor: idea.similarity && idea.similarity > 0.7 ? '#e8f5e9' : '#f5f5f5',
                                color: idea.similarity && idea.similarity > 0.7 ? '#2e7d32' : '#616161',
                                border: `1px solid ${idea.similarity && idea.similarity > 0.7 ? '#c8e6c9' : '#e0e0e0'}`
                            }}>
                                {similarityPercent}
                            </span>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}
