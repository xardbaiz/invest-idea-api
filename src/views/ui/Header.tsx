import { h } from 'preact';

export function Header() {
    return (
        <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 500, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1a1a1a' }}>
                <span className="material-icons" style={{ fontSize: '36px', color: '#1976d2' }}>lightbulb</span>
                Поиск инвестиционных идей
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
                Умный векторный поиск по аналитике и рекомендациям
            </p>
        </div>
    );
}
