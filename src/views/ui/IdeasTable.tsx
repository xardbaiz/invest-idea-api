import {IdeaItem, IdeaRow} from './IdeaRow.js';

interface IdeasTableProps {
    ideas: IdeaItem[];
    searched: boolean;
}

export function IdeasTable({ ideas, searched }: IdeasTableProps) {
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
                    Введите поисковый запрос или задайте параметры фильтрации для поиска инвестиционных идей.
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
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Идеи не найдены</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                    Попробуйте изменить поисковый запрос или расширить временной интервал.
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
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333' }}>Тикер</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333' }}>Компания</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333' }}>Сводка</th>
                            <th style={{padding: '16px', fontWeight: 600, color: '#333', textAlign: 'right'}}>Текущая
                                цена
                            </th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'right' }}>Целевая цена</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'center' }}>Релевантность</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#333', textAlign: 'right' }}>Дата публикации</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ideas.map((idea, index) => (
                            <IdeaRow key={idea.ticker ? `${idea.ticker}-${index}` : index} idea={idea} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
