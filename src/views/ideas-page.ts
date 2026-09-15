import {h} from 'preact';
import {renderToString} from 'preact-render-to-string';

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
        statusMessage.innerHTML = 'Загрузка результатов...';

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
            tr.className = 'mdc-data-table__row';

            // Ticker
            const tickerCell = document.createElement('td');
            tickerCell.className = 'mdc-data-table__cell';
            const tickerLink = document.createElement('a');
            tickerLink.className = 'mdc-chip';
            tickerLink.style.textDecoration = 'none';
            tickerLink.href = item.url || '#';
            tickerLink.target = '_blank';
            tickerLink.rel = 'noopener noreferrer';

            const chipText = document.createElement('span');
            chipText.className = 'mdc-chip__text';
            chipText.style.fontWeight = 'bold';
            chipText.textContent = idea.ticker || 'N/A';
            tickerLink.appendChild(chipText);
            tickerCell.appendChild(tickerLink);
            tr.appendChild(tickerCell);

            // Company Name
            const companyCell = document.createElement('td');
            companyCell.className = 'mdc-data-table__cell';
            companyCell.style.fontWeight = '500';
            companyCell.textContent = idea.companyName || '—';
            tr.appendChild(companyCell);

            // Target Price
            const priceCell = document.createElement('td');
            priceCell.className = 'mdc-data-table__cell';
            priceCell.style.color = '#2e7d32';
            priceCell.style.fontWeight = 'bold';
            priceCell.textContent = idea.targetPrice ? (idea.targetPrice + ' ' + (idea.currency || '')) : '—';
            tr.appendChild(priceCell);

            // Publish Date
            const dateCell = document.createElement('td');
            dateCell.className = 'mdc-data-table__cell';
            if (idea.publishDate) {
                const d = new Date(idea.publishDate);
                dateCell.textContent = isNaN(d.getTime()) ? idea.publishDate : d.toLocaleDateString('ru-RU');
            } else {
                dateCell.textContent = '—';
            }
            tr.appendChild(dateCell);

            // Distance
            const distCell = document.createElement('td');
            distCell.className = 'mdc-data-table__cell';
            const distSpan = document.createElement('span');
            distSpan.className = 'mdc-chip';
            distSpan.style.backgroundColor = '#f3e5f5';
            distSpan.style.color = '#7b1fa2';
            const distText = document.createElement('span');
            distText.className = 'mdc-chip__text';
            distText.textContent = typeof item.distance === 'number' ? item.distance.toFixed(4) : '—';
            distSpan.appendChild(distText);
            distCell.appendChild(distSpan);
            tr.appendChild(distCell);

            // Description (collapsible)
            const descCell = document.createElement('td');
            descCell.className = 'mdc-data-table__cell';
            const descContainer = document.createElement('div');
            descContainer.style.maxWidth = '450px';
            descContainer.style.wordBreak = 'break-word';

            const fullDesc = idea.description || idea.title || '';
            const maxLen = 140;

            if (fullDesc.length > maxLen) {
                const shortText = fullDesc.slice(0, maxLen) + '...';

                const textSpan = document.createElement('span');
                textSpan.textContent = shortText;

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'mdc-button mdc-button--dense';
                toggleBtn.style.padding = '0';
                toggleBtn.style.marginTop = '4px';

                const btnLabel = document.createElement('span');
                btnLabel.className = 'mdc-button__label';
                btnLabel.textContent = 'Развернуть';
                toggleBtn.appendChild(btnLabel);

                let expanded = false;

                toggleBtn.onclick = () => {
                    expanded = !expanded;
                    if (expanded) {
                        textSpan.textContent = fullDesc;
                        btnLabel.textContent = 'Свернуть';
                    } else {
                        textSpan.textContent = shortText;
                        btnLabel.textContent = 'Развернуть';
                    }
                };

                descContainer.appendChild(textSpan);
                descContainer.appendChild(document.createElement('br'));
                descContainer.appendChild(toggleBtn);
            } else {
                const textSpan = document.createElement('span');
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

function Header() {
    return h('header', {style: 'text-align: center; margin-bottom: 24px;'}, [
        h('h1', {class: 'mdc-typography--headline4', style: 'margin-bottom: 8px; font-weight: 500;'}, [
            h('span', {class: 'material-icons', style: 'vertical-align: middle; margin-right: 8px; color: #1976d2; font-size: 36px;'}, 'lightbulb'),
            'Поиск инвестиционных идей'
        ]),
        h('p', {class: 'mdc-typography--subtitle1', style: 'color: #666;'}, 'Умный векторный поиск по аналитике и рекомендациям'),
    ]);
}

function SearchForm() {
    return h('div', {class: 'mdc-card', style: 'padding: 24px; margin-bottom: 24px;'}, [
        h('form', {id: 'searchForm', style: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: end;'}, [
            h('div', {style: 'grid-column: 1 / -1; display: flex; flex-direction: column;'}, [
                h('label', {class: 'mdc-typography--caption', style: 'margin-bottom: 4px; font-weight: bold; text-transform: uppercase; color: #555;'}, 'Поисковый запрос *'),
                h('label', {class: 'mdc-text-field mdc-text-field--outlined', style: 'width: 100%;'}, [
                    h('input', {
                        type: 'text',
                        id: 'query',
                        name: 'query',
                        class: 'mdc-text-field__input',
                        placeholder: 'Например: искусственный интеллект, гигафабрика, биотех',
                        required: true,
                        style: 'padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; width: 100%;',
                    }),
                ]),
            ]),
            h('div', {style: 'display: flex; flex-direction: column;'}, [
                h('label', {class: 'mdc-typography--caption', style: 'margin-bottom: 4px; font-weight: bold; text-transform: uppercase; color: #555;'}, 'Дата от (from)'),
                h('input', {type: 'date', id: 'from', name: 'from', style: 'padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;'}),
            ]),
            h('div', {style: 'display: flex; flex-direction: column;'}, [
                h('label', {class: 'mdc-typography--caption', style: 'margin-bottom: 4px; font-weight: bold; text-transform: uppercase; color: #555;'}, 'Дата до (to)'),
                h('input', {type: 'date', id: 'to', name: 'to', style: 'padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;'}),
            ]),
            h('div', {style: 'display: flex; flex-direction: column;'}, [
                h('label', {class: 'mdc-typography--caption', style: 'margin-bottom: 4px; font-weight: bold; text-transform: uppercase; color: #555;'}, 'Лимит результатов'),
                h('input', {type: 'number', id: 'limit', name: 'limit', value: '10', min: '1', max: '100', style: 'padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;'}),
            ]),
            h('button', {type: 'submit', class: 'mdc-button mdc-button--raised', style: 'grid-column: 1 / -1; height: 48px; border-radius: 24px; background-color: #1976d2; font-size: 15px; font-weight: bold;'}, [
                h('span', {class: 'material-icons mdc-button__icon'}, 'search'),
                h('span', {class: 'mdc-button__label'}, 'Искать идеи'),
            ]),
        ]),
    ]);
}

function ResultsSection() {
    return h('div', {}, [
        h('div', {id: 'errorContainer', class: 'hidden', style: 'padding: 16px; background-color: #ffebee; color: #c62828; border-radius: 4px; margin-bottom: 16px; font-weight: 500;'}),
        h('div', {id: 'resultsCard', class: 'mdc-card', style: 'padding: 16px;'}, [
            h('div', {id: 'statusMessage', class: 'mdc-typography--body1', style: 'text-align: center; padding: 32px; color: #666;'}, 'Введите запрос для поиска инвестиционных идей'),
            h('div', {id: 'tableContainer', class: 'mdc-data-table hidden', style: 'width: 100%; border: none;'}, [
                h('table', {class: 'mdc-data-table__table', style: 'width: 100%;'}, [
                    h('thead', {}, [
                        h('tr', {class: 'mdc-data-table__header-row'}, [
                            h('th', {class: 'mdc-data-table__header-cell', style: 'font-weight: bold; color: #333;'}, 'Тикер'),
                            h('th', {class: 'mdc-data-table__header-cell', style: 'font-weight: bold; color: #333;'}, 'Компания'),
                            h('th', {class: 'mdc-data-table__header-cell', style: 'font-weight: bold; color: #333;'}, 'Целевая цена'),
                            h('th', {class: 'mdc-data-table__header-cell', style: 'font-weight: bold; color: #333;'}, 'Дата публикации'),
                            h('th', {class: 'mdc-data-table__header-cell', style: 'font-weight: bold; color: #333;'}, 'Релевантность (Distance)'),
                            h('th', {class: 'mdc-data-table__header-cell', style: 'font-weight: bold; color: #333;'}, 'Описание'),
                        ]),
                    ]),
                    h('tbody', {id: 'resultsBody', class: 'mdc-data-table__content'}),
                ]),
            ]),
        ]),
    ]);
}

function IdeasPageLayout() {
    return h('div', {class: 'mdc-typography', style: 'max-width: 1140px; margin: 0 auto; padding: 24px 16px;'}, [
        h(Header, {}),
        h(SearchForm, {}),
        h(ResultsSection, {}),
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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css">
    <style>
        body { background-color: #f5f5f5; margin: 0; padding: 0; font-family: Roboto, sans-serif; }
        .hidden { display: none !important; }
    </style>
</head>
<body class="mdc-typography">
    ${pageHtml}
    <script>${clientScript}</script>
</body>
</html>`;
}
