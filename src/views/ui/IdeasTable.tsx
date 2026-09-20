import { Language, getTranslations } from './i18n/translations.js';
import { IdeaItem, IdeaRow } from './IdeaRow.js';

interface IdeasTableProps {
    ideas: IdeaItem[];
    searched: boolean;
    lang?: Language;
}

export function IdeasTable({ ideas, searched, lang = 'en' }: IdeasTableProps) {
    const t = getTranslations(lang);

    if (!searched && ideas.length === 0) {
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
                <p style={{ margin: 0, fontSize: '1.05rem' }}>
                    {t.tablePromptInitial}
                </p>
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
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{t.tableNoResultsTitle}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                    {t.tableNoResultsText}
                </p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table id="ideasTable" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333' }}>{t.thTicker}</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333' }}>{t.thCompany}</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333' }}>{t.thSummary}</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'right' }}>{t.thCurrentPrice}</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'right' }}>{t.thTargetPrice}</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'center' }}>{t.thRelevance}</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'right' }}>{t.thPublishDate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ideas.map((idea, index) => (
                            <IdeaRow key={idea.ticker ? `${idea.ticker}-${index}` : index} idea={idea} index={index} lang={lang} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
