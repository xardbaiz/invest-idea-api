import React from 'react';
import { renderToString } from 'react-dom/server';
import { LandingPage } from './ui/LandingPage.js';
import { Language, getTranslations } from './ui/i18n/i18n.js';

export interface RenderLandingPageOptions {
    lang?: Language;
}

export function renderLandingPage(options: RenderLandingPageOptions = {}): string {
    const { lang = 'en' } = options;
    const t = getTranslations(lang);

    const pageHtml = renderToString(
        React.createElement(LandingPage as any, { lang })
    );

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.brandName} — AI Investment Engine</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #0b1326; color: #dae2fd; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
    </style>
</head>
<body>
    <div id="root">${pageHtml}</div>
</body>
</html>`;
}
