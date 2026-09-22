import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './ui/App.js';
import { IdeaItem } from './ui/IdeaRow.js';
import { Language, getTranslations } from './ui/i18n/i18n.js';

export interface RenderIdeasPageOptions {
    query?: string;
    from?: string;
    to?: string;
    limit?: number;
    ideas?: IdeaItem[];
    searched?: boolean;
    lang?: Language;
}

export function renderIdeasPage(options: RenderIdeasPageOptions = {}): string {
    const { query = '', from = '', to = '', limit = 10, ideas = [], searched = false, lang = 'en' } = options;
    const t = getTranslations(lang);

    const pageHtml = renderToString(
        React.createElement(App as any, {
            query,
            from,
            to,
            limit,
            ideas,
            searched,
            lang
        })
    );

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.ideasPageTitle}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style>
        body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Roboto, sans-serif; }
    </style>
</head>
<body>
    <div id="root">${pageHtml}</div>
    <script src="/js/ideas-client.js"></script>
</body>
</html>`;
}
