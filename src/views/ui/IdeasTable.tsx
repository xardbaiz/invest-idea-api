import React from 'react';
import { IdeaRow, IdeaItem } from './IdeaRow.js';
import { Language, getTranslations } from './i18n/i18n.js';

interface IdeasTableProps {
    ideas: IdeaItem[];
    searched?: boolean;
    lang?: Language;
}

export function IdeasTable({ ideas, searched = false, lang = 'en' }: IdeasTableProps) {
    const t = getTranslations(lang);

    if (!searched) {
        return (
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                color: '#666',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <p style={{ margin: 0, fontSize: '1.05rem' }}>{t.ideasSearchInitialPrompt}</p>
            </div>
        );
    }

    if (ideas.length === 0) {
        return (
            <div style={{
                backgroundColor: '#fff8e1',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                color: '#856404',
                border: '1px solid #ffeba2'
            }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{t.noIdeasFoundTitle}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{t.noIdeasFoundDesc}</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0', color: '#555', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '16px' }}>{t.thTicker}</th>
                            <th style={{ padding: '16px' }}>{t.thCompany}</th>
                            <th style={{ padding: '16px' }}>{t.thSummary}</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>{t.thCurrentPrice}</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>{t.thTargetPrice}</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>{t.thRelevance}</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>{t.thDate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ideas.map((idea, index) => (
                            <IdeaRow key={index} idea={idea} index={index} lang={lang} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
