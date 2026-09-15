export function renderIdeasPage(): string {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Поиск инвестиционных идей</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --radius: 10px;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        body {
            background-color: var(--bg-body);
            color: var(--text-main);
            padding: 2rem 1rem;
            line-height: 1.5;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            margin-bottom: 2rem;
            text-align: center;
        }

        header h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }

        header p {
            color: var(--text-muted);
            font-size: 1rem;
        }

        .card {
            background: var(--bg-card);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 2rem;
            border: 1px solid var(--border);
        }

        .search-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            align-items: end;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }

        .form-group.span-full {
            grid-column: 1 / -1;
        }

        label {
            font-size: 0.875rem;
            font-weight: 600;
            color: #334155;
        }

        input[type="text"],
        input[type="date"],
        input[type="number"] {
            width: 100%;
            padding: 0.65rem 0.85rem;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .btn-submit {
            grid-column: 1 / -1;
            padding: 0.75rem 1.5rem;
            background-color: var(--primary);
            color: white;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.1s;
        }

        .btn-submit:hover {
            background-color: var(--primary-hover);
        }

        .btn-submit:active {
            transform: scale(0.99);
        }

        .status-message {
            text-align: center;
            padding: 2rem;
            color: var(--text-muted);
            font-size: 1.1rem;
        }

        .error-message {
            background-color: #fef2f2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #fecaca;
            margin-bottom: 1rem;
        }

        .table-responsive {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.95rem;
        }

        th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 600;
            padding: 0.85rem 1rem;
            border-bottom: 2px solid var(--border);
            white-space: nowrap;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
        }

        tr:hover {
            background-color: #f8fafc;
        }

        .ticker-badge {
            display: inline-block;
            padding: 0.25rem 0.6rem;
            background-color: #eff6ff;
            color: var(--primary);
            font-weight: 700;
            border-radius: 4px;
            text-decoration: none;
            border: 1px solid #bfdbfe;
            transition: background-color 0.2s, color 0.2s;
        }

        .ticker-badge:hover {
            background-color: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        .company-name {
            font-weight: 600;
            color: #1e293b;
        }

        .target-price {
            white-space: nowrap;
            font-weight: 600;
            color: #059669;
        }

        .distance-tag {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            background-color: #f3e8ff;
            color: #6b21a8;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.85rem;
            white-space: nowrap;
        }

        .date-cell {
            white-space: nowrap;
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .desc-container {
            max-width: 450px;
            word-wrap: break-word;
        }

        .desc-text {
            color: #334155;
            line-height: 1.45;
        }

        .toggle-btn {
            background: none;
            border: none;
            color: var(--primary);
            font-weight: 600;
            cursor: pointer;
            padding: 0;
            margin-top: 0.35rem;
            font-size: 0.85rem;
            text-decoration: underline;
        }

        .toggle-btn:hover {
            color: var(--primary-hover);
        }

        .hidden {
            display: none;
        }

        .spinner {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border: 3px solid rgba(37, 99, 235, 0.2);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 0.8s linear infinite;
            vertical-align: middle;
            margin-right: 0.5rem;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>💡 Поиск инвестиционных идей</h1>
            <p>Умный векторный поиск по аналитике и рекомендациям</p>
        </header>

        <div class="card">
            <form id="searchForm" class="search-form">
                <div class="form-group span-full">
                    <label for="query">Поисковый запрос *</label>
                    <input type="text" id="query" name="query" placeholder="Например: искусственный интеллект, гигафабрика, биотех" required>
                </div>

                <div class="form-group">
                    <label for="from">Дата от (from)</label>
                    <input type="date" id="from" name="from">
                </div>

                <div class="form-group">
                    <label for="to">Дата до (to)</label>
                    <input type="date" id="to" name="to">
                </div>

                <div class="form-group">
                    <label for="limit">Лимит результатов</label>
                    <input type="number" id="limit" name="limit" value="10" min="1" max="100">
                </div>

                <button type="submit" class="btn-submit">Искать идеи</button>
            </form>
        </div>

        <div id="errorContainer" class="error-message hidden"></div>

        <div id="resultsCard" class="card">
            <div id="statusMessage" class="status-message">Введите запрос для поиска инвестиционных идей</div>
            <div id="tableContainer" class="table-responsive hidden">
                <table>
                    <thead>
                        <tr>
                            <th>Тикер</th>
                            <th>Компания</th>
                            <th>Целевая цена</th>
                            <th>Дата публикации</th>
                            <th>Релевантность (Distance)</th>
                            <th>Описание</th>
                        </tr>
                    </thead>
                    <tbody id="resultsBody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
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
            statusMessage.innerHTML = '<div class="spinner"></div> Выполняется поиск...';

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
                tickerLink.className = 'ticker-badge';
                tickerLink.href = item.url || '#';
                tickerLink.target = '_blank';
                tickerLink.rel = 'noopener noreferrer';
                tickerLink.textContent = idea.ticker || 'N/A';
                tickerCell.appendChild(tickerLink);
                tr.appendChild(tickerCell);

                // Company Name
                const companyCell = document.createElement('td');
                companyCell.className = 'company-name';
                companyCell.textContent = idea.companyName || '—';
                tr.appendChild(companyCell);

                // Target Price
                const priceCell = document.createElement('td');
                priceCell.className = 'target-price';
                priceCell.textContent = idea.targetPrice ? (idea.targetPrice + ' ' + (idea.currency || '')) : '—';
                tr.appendChild(priceCell);

                // Publish Date
                const dateCell = document.createElement('td');
                dateCell.className = 'date-cell';
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
                distSpan.className = 'distance-tag';
                distSpan.textContent = typeof item.distance === 'number' ? item.distance.toFixed(4) : '—';
                distCell.appendChild(distSpan);
                tr.appendChild(distCell);

                // Description (collapsible)
                const descCell = document.createElement('td');
                const descContainer = document.createElement('div');
                descContainer.className = 'desc-container';

                const fullDesc = idea.description || idea.title || '';
                const maxLen = 140;

                if (fullDesc.length > maxLen) {
                    const shortText = fullDesc.slice(0, maxLen) + '...';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'desc-text';
                    textSpan.textContent = shortText;

                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'toggle-btn';
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
                    textSpan.className = 'desc-text';
                    textSpan.textContent = fullDesc || '—';
                    descContainer.appendChild(textSpan);
                }

                descCell.appendChild(descContainer);
                tr.appendChild(descCell);

                resultsBody.appendChild(tr);
            });
        }

        window.addEventListener('DOMContentLoaded', initFromUrl);
    </script>
</body>
</html>`;
}
