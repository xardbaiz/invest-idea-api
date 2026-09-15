import {h} from 'preact';
import {renderToString} from 'preact-render-to-string';

const materialStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    :root {
        --md-primary: #1976d2;
        --md-primary-hover: #1565c0;
        --md-surface: #ffffff;
        --md-background: #f5f5f5;
        --md-on-background: #1c1b1f;
        --md-outline: #79747e;
        --md-border-color: rgba(0, 0, 0, 0.12);
        --md-elevation-1: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
        --md-elevation-2: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Roboto', sans-serif;
    }

    body {
        background-color: var(--md-background);
        color: var(--md-on-background);
        padding: 2.5rem 1rem;
        line-height: 1.5;
    }

    .container {
        max-width: 1140px;
        margin: 0 auto;
    }

    .md-app-bar {
        text-align: center;
        margin-bottom: 2rem;
    }

    .md-app-bar h1 {
        font-size: 2.25rem;
        font-weight: 500;
        color: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .md-app-bar p {
        color: #666;
        font-size: 1rem;
        margin-top: 0.35rem;
    }

    .md-card {
        background: var(--md-surface);
        border-radius: 12px;
        box-shadow: var(--md-elevation-1);
        padding: 1.75rem;
        margin-bottom: 2rem;
        transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .md-card:hover {
        box-shadow: var(--md-elevation-2);
    }

    .md-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.25rem;
        align-items: end;
    }

    .md-field {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .md-field.span-full {
        grid-column: 1 / -1;
    }

    .md-field label {
        font-size: 0.8rem;
        font-weight: 500;
        color: #555;
        margin-bottom: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .md-input {
        width: 100%;
        padding: 0.75rem 0.85rem;
        border: 1px solid var(--md-outline);
        border-radius: 6px;
        font-size: 0.95rem;
        background-color: transparent;
        color: var(--md-on-background);
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .md-input:focus {
        border-color: var(--md-primary);
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }

    .md-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        grid-column: 1 / -1;
        padding: 0.85rem 1.75rem;
        background-color: var(--md-primary);
        color: white;
        font-weight: 500;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.75px;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
        transition: background-color 0.2s, box-shadow 0.2s;
    }

    .md-btn:hover {
        background-color: var(--md-primary-hover);
        box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }

    .md-table-container {
        overflow-x: auto;
    }

    .md-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        text-align: left;
    }

    .md-table th {
        background-color: #fafafa;
        color: #444;
        font-weight: 500;
        padding: 1rem 0.85rem;
        border-bottom: 2px solid var(--md-border-color);
        white-space: nowrap;
    }

    .md-table td {
        padding: 1rem 0.85rem;
        border-bottom: 1px solid var(--md-border-color);
        vertical-align: top;
    }

    .md-table tbody tr:hover {
        background-color: #f0f4f9;
    }

    .md-chip {
        display: inline-flex;
        align-items: center;
        padding: 0.3rem 0.75rem;
        background-color: #e3f2fd;
        color: #0d47a1;
        font-weight: 700;
        border-radius: 16px;
        text-decoration: none;
        font-size: 0.85rem;
        transition: background-color 0.2s;
    }

    .md-chip:hover {
        background-color: #bbdefb;
    }

    .md-price {
        color: #2e7d32;
        font-weight: 700;
        white-space: nowrap;
    }

    .md-distance-chip {
        display: inline-block;
        padding: 0.25rem 0.6rem;
        background-color: #f3e5f5;
        color: #7b1fa2;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.8rem;
    }

    .md-text-btn {
        background: none;
        border: none;
        color: var(--md-primary);
        font-weight: 500;
        font-size: 0.85rem;
        cursor: pointer;
        padding: 0;
        margin-top: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .md-text-btn:hover {
        text-decoration: underline;
    }

    .status-msg {
        text-align: center;
        padding: 2.5rem;
        color: #666;
        font-size: 1.05rem;
    }

    .error-banner {
        background-color: #ffebee;
        color: #c62828;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        border: 1px solid #ffcdd2;
        margin-bottom: 1.25rem;
        font-weight: 500;
    }

    .hidden {
        display: none !important;
    }

    .spinner {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        border: 3px solid rgba(25, 118, 210, 0.2);
        border-radius: 50%;
        border-top-color: var(--md-primary);
        animation: spin 0.8s linear infinite;
        vertical-align: middle;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const clientScript = `
    const searchForm = document.getElementById('searchForm');
    const queryInput = document.getElementById('query');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const limitInput = document.getElementById('limit');

    const statusMessage = document.getElementById('statusMessage');
    const tableContainer = document.getElementById('tableContainer');
    const resultsBody = document.getElementById('resultsBody');
    const errorContainer = document.getElementById('errorContainer');

    function initFromUrl() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('query')) queryInput.value = params.get('query');
        if (params.has('from')) fromInput.value = params.get('from');
        if (params.has('to')) toInput.value = params.get('to');
        if (params.has('limit')) limitInput.value = params.get('limit');

        if (queryInput.value.trim()) {
            fetchResults();
        }
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateUrl();
        fetchResults();
    });

    function updateUrl() {
        const params = new URLSearchParams();
        if (queryInput.value.trim()) params.set('query', queryInput.value.trim());
        if (fromInput.value) params.set('from', fromInput.value);
        if (toInput.value) params.set('to', toInput.value);
        if (limitInput.value) params.set('limit', limitInput.value);

        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.pushState({}, '', newUrl);
    }

    async function fetchResults() {
        const query = queryInput.value.trim();
        if (!query) return;

        errorContainer.classList.add('hidden');
        tableContainer.classList.add('hidden');
        statusMessage.classList.remove('hidden');
        statusMessage.innerHTML = '<div class="spinner"></div> Поиск и анализ результатов...';

        const params = new URLSearchParams({
            query: query,
            limit: limitInput.value || 10
        });
        if (fromInput.value) params.set('from', fromInput.value);
        if (toInput.value) params.set('to', toInput.value);

        try {
            const response = await fetch('/api/ideas?' + params.toString());
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Ошибка сервера при получении идей');
            }

            const data = await response.json();
            renderTable(data);
        } catch (err) {
            statusMessage.classList.add('hidden');
            errorContainer.classList.remove('hidden');
            errorContainer.textContent = 'Ошибка: ' + err.message;
        }
    }

    function renderTable(data) {
        if (!data || data.length === 0) {
            statusMessage.classList.remove('hidden');
            statusMessage.textContent = 'По вашему запросу ничего не найдено.';
            tableContainer.classList.add('hidden');
            return;
        }

        statusMessage.classList.add('hidden');
        tableContainer.classList.remove('hidden');
        resultsBody.innerHTML = '';

        data.forEach((item) => {
            const idea = item.idea || {};
            const tr = document.createElement('tr');

            // Ticker
            const tickerCell = document.createElement('td');
            const tickerLink = document.createElement('a');
            tickerLink.className = 'md-chip';
            tickerLink.href = item.url || '#';
            tickerLink.target = '_blank';
            tickerLink.rel = 'noopener noreferrer';
            tickerLink.textContent = idea.ticker || 'N/A';
            tickerCell.appendChild(tickerLink);
            tr.appendChild(tickerCell);

            // Company Name
            const companyCell = document.createElement('td');
            companyCell.style.fontWeight = '500';
            companyCell.textContent = idea.companyName || '—';
            tr.appendChild(companyCell);

            // Target Price
            const priceCell = document.createElement('td');
            priceCell.className = 'md-price';
            priceCell.textContent = idea.targetPrice ? (idea.targetPrice + ' ' + (idea.currency || '')) : '—';
            tr.appendChild(priceCell);

            // Publish Date
            const dateCell = document.createElement('td');
            dateCell.style.whiteSpace = 'nowrap';
            dateCell.style.color = '#666';
            if (idea.publishDate) {
                const d = new Date(idea.publishDate);
                dateCell.textContent = isNaN(d.getTime()) ? idea.publishDate : d.toLocaleDateString('ru-RU');
            } else {
                dateCell.textContent = '—';
            }
            tr.appendChild(dateCell);

            // Distance
            const distCell = document.createElement('td');
            const distSpan = document.createElement('span');
            distSpan.className = 'md-distance-chip';
            distSpan.textContent = typeof item.distance === 'number' ? item.distance.toFixed(4) : '—';
            distCell.appendChild(distSpan);
            tr.appendChild(distCell);

            // Description (collapsible)
            const descCell = document.createElement('td');
            const descContainer = document.createElement('div');
            descContainer.style.maxWidth = '450px';
            descContainer.style.wordBreak = 'break-word';

            const fullDesc = idea.description || idea.title || '';
            const maxLen = 140;

            if (fullDesc.length > maxLen) {
                const shortText = fullDesc.slice(0, maxLen) + '...';

                const textSpan = document.createElement('span');
                textSpan.style.color = '#333';
                textSpan.style.lineHeight = '1.45';
                textSpan.textContent = shortText;

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'md-text-btn';
                toggleBtn.textContent = 'Развернуть';
                let expanded = false;

                toggleBtn.onclick = () => {
                    expanded = !expanded;
                    if (expanded) {
                        textSpan.textContent = fullDesc;
                        toggleBtn.textContent = 'Свернуть';
                    } else {
                        textSpan.textContent = shortText;
                        toggleBtn.textContent = 'Развернуть';
                    }
                };

                descContainer.appendChild(textSpan);
                descContainer.appendChild(document.createElement('br'));
                descContainer.appendChild(toggleBtn);
            } else {
                const textSpan = document.createElement('span');
                textSpan.style.color = '#333';
                textSpan.style.lineHeight = '1.45';
                textSpan.textContent = fullDesc || '—';
                descContainer.appendChild(textSpan);
            }

            descCell.appendChild(descContainer);
            tr.appendChild(descCell);

            resultsBody.appendChild(tr);
        });
    }

    window.addEventListener('DOMContentLoaded', initFromUrl);
`;

function MaterialHeader() {
    return h('header', {class: 'md-app-bar'}, [
        h('h1', {}, [
            h('span', {class: 'material-symbols-outlined', style: 'font-size: 2.2rem; color: #1976d2;'}, 'lightbulb'),
            'Поиск инвестиционных идей'
        ]),
        h('p', {}, 'Умный векторный поиск по аналитике и рекомендациям'),
    ]);
}

function MaterialSearchForm() {
    return h('div', {class: 'md-card'}, [
        h('form', {id: 'searchForm', class: 'md-form-grid'}, [
            h('div', {class: 'md-field span-full'}, [
                h('label', {for: 'query'}, 'Поисковый запрос *'),
                h('input', {
                    type: 'text',
                    id: 'query',
                    name: 'query',
                    class: 'md-input',
                    placeholder: 'Например: искусственный интеллект, гигафабрика, биотех',
                    required: true,
                }),
            ]),
            h('div', {class: 'md-field'}, [
                h('label', {for: 'from'}, 'Дата от (from)'),
                h('input', {type: 'date', id: 'from', name: 'from', class: 'md-input'}),
            ]),
            h('div', {class: 'md-field'}, [
                h('label', {for: 'to'}, 'Дата до (to)'),
                h('input', {type: 'date', id: 'to', name: 'to', class: 'md-input'}),
            ]),
            h('div', {class: 'md-field'}, [
                h('label', {for: 'limit'}, 'Лимит результатов'),
                h('input', {type: 'number', id: 'limit', name: 'limit', class: 'md-input', value: '10', min: '1', max: '100'}),
            ]),
            h('button', {type: 'submit', class: 'md-btn'}, [
                h('span', {class: 'material-symbols-outlined'}, 'search'),
                'Искать идеи'
            ]),
        ]),
    ]);
}

function MaterialResultsSection() {
    return h('div', {}, [
        h('div', {id: 'errorContainer', class: 'error-banner hidden'}),
        h('div', {id: 'resultsCard', class: 'md-card'}, [
            h('div', {id: 'statusMessage', class: 'status-msg'}, 'Введите запрос для поиска инвестиционных идей'),
            h('div', {id: 'tableContainer', class: 'md-table-container hidden'}, [
                h('table', {class: 'md-table'}, [
                    h('thead', {}, [
                        h('tr', {}, [
                            h('th', {}, 'Тикер'),
                            h('th', {}, 'Компания'),
                            h('th', {}, 'Целевая цена'),
                            h('th', {}, 'Дата публикации'),
                            h('th', {}, 'Релевантность (Distance)'),
                            h('th', {}, 'Описание'),
                        ]),
                    ]),
                    h('tbody', {id: 'resultsBody'}),
                ]),
            ]),
        ]),
    ]);
}

function IdeasPageLayout() {
    return h('div', {class: 'container'}, [
        h(MaterialHeader, {}),
        h(MaterialSearchForm, {}),
        h(MaterialResultsSection, {}),
    ]);
}

export function renderIdeasPage(): string {
    const pageHtml = renderToString(h(IdeasPageLayout, {}));

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Поиск инвестиционных идей</title>
    <style>${materialStyles}</style>
</head>
<body>
    ${pageHtml}
    <script>${clientScript}</script>
</body>
</html>`;
}
