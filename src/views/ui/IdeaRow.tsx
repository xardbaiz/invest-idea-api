import { Language, getTranslations } from './i18n/translations.js';

export interface IdeaItem {
    ticker?: string;
    companyName?: string;
    summary?: string;
    description?: string;
    targetPrice?: number | null;
    currentPrice?: number | null;
    url?: string | null;
    publishDate?: string | null;
    similarity?: number | null;
}

interface IdeaRowProps {
    idea: IdeaItem;
    index: number;
    lang?: Language;
}

export function IdeaRow({ idea, index, lang = 'en' }: IdeaRowProps) {
    const t = getTranslations(lang);
    const rowId = `idea-${index}`;
    const descId = `desc-${index}`;
    const btnId = `btn-${index}`;

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

    const toggleScript = `var f=document.getElementById('${descId}-full'), s=document.getElementById('${descId}-short'), b=document.getElementById('${btnId}'); if(f.style.display==='none'){f.style.display='inline'; s.style.display='none'; b.innerText='${t.btnCollapse}';}else{f.style.display='none'; s.style.display='inline'; b.innerText='${t.btnExpand}';}`;

    return (
        <tr id={rowId} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.15s' }}>
            <td style={{ padding: '16px', fontWeight: 'bold' }}>
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
                        {idea.ticker}
                        <span className="material-icons" style={{ fontSize: '14px' }}>open_in_new</span>
                    </a>
                ) : (
                    <span>{idea.ticker || '—'}</span>
                )}
            </td>
            <td style={{ padding: '16px', fontWeight: 500, color: '#333' }}>
                {idea.companyName || '—'}
            </td>
            <td style={{ padding: '16px', maxWidth: '400px', lineHeight: '1.5', color: '#444', whiteSpace: 'pre-line' }}>
                {isLong ? (
                    <div>
                        <span id={`${descId}-short`}>{shortText} </span>
                        <span id={`${descId}-full`} style={{ display: 'none' }}>{text} </span>
                        <button
                            type="button"
                            id={btnId}
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
                            onClick={toggleScript as any}
                        >
                            {t.btnExpand}
                        </button>
                    </div>
                ) : (
                    <span>{text || '—'}</span>
                )}
            </td>
            <td style={{
                padding: '16px',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                color: isGreenPrice ? '#2e7d32' : undefined
            }}>
                {idea.currentPrice != null ? `$${idea.currentPrice.toFixed(2)}` : '—'}
            </td>
            <td style={{
                padding: '16px',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                color: isGreenPrice ? '#2e7d32' : undefined
            }}>
                {idea.targetPrice != null ? `$${idea.targetPrice}${isGreenPrice ? ` (+${currentToTargetPercentage}%)` : ''}` : '—'}
            </td>
            <td style={{ padding: '16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: idea.similarity && idea.similarity > 0.7 ? '#e8f5e9' : '#f5f5f5',
                    color: idea.similarity && idea.similarity > 0.7 ? '#2e7d32' : '#616161',
                    border: `1px solid ${idea.similarity && idea.similarity > 0.7 ? '#c8e6c9' : '#e0e0e0'}`
                }}>
                    {similarityPercent}
                </span>
            </td>
            <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap', color: '#666', fontSize: '0.875rem' }}>
                {formattedDate}
            </td>
        </tr>
    );
}
