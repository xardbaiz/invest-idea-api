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
                padding: '24px 16px',
                textAlign: 'center',
                color: '#666',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <p style={{ margin: 0, fontSize: '1rem' }}>{t.ideasSearchInitialPrompt}</p>
            </div>
        );
    }

    if (ideas.length === 0) {
        return (
            <div style={{
                backgroundColor: '#fff8e1',
                borderRadius: '12px',
                padding: '24px 16px',
                textAlign: 'center',
                color: '#856404',
                border: '1px solid #ffeba2'
            }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{t.noIdeasFoundTitle}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{t.noIdeasFoundDesc}</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            width: '100%'
        }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '12px 10px', width: '22%', minWidth: '110px' }}>{t.thTicker} / {t.thCompany}</th>
                            <th style={{ padding: '12px 10px', width: '52%' }}>{t.thSummary}</th>
                            <th style={{ padding: '12px 10px', width: '26%', minWidth: '130px', textAlign: 'right' }}>{t.thCurrentPrice} / {t.thTargetPrice} / {t.thRelevance}</th>
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
