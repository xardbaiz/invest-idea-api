import React from 'react';
import { renderToString } from 'react-dom/server';

jest.mock('../ui/i18n/i18n.js', () => ({
    getTranslations: () => ({
        thTicker: 'Ticker',
        thCompany: 'Company',
        thSummary: 'Summary',
        thCurrentPrice: 'Current Price',
        thTargetPrice: 'Target Price',
        thRelevance: 'Relevance',
        thPublishDate: 'Publish Date',
        ideasSearchInitialPrompt: 'Enter a search query',
        noIdeasFoundTitle: 'No ideas found',
        noIdeasFoundDesc: 'Try changing your search query',
        btnExpand: 'Expand',
        btnCollapse: 'Collapse'
    })
}));

import { IdeasTable } from '../ui/IdeasTable.js';

describe('IdeasTable and IdeaRow Components', () => {
    it('renders initial search prompt when not searched', () => {
        const html = renderToString(<IdeasTable ideas={[]} searched={false} />);
        expect(html).toContain('Enter a search query');
    });

    it('renders no results message when searched and no ideas returned', () => {
        const html = renderToString(<IdeasTable ideas={[]} searched={true} />);
        expect(html).toContain('No ideas found');
    });

    it('renders 3 column groups and sub-headings', () => {
        const mockIdea = {
            ticker: 'APPF.US',
            companyName: 'Appfolio Inc',
            summary: 'Sector: Software Business: Property management platform Idea: Strong upside potential',
            currentPrice: 210.00,
            targetPrice: 250.00,
            similarity: 0.85,
            publishDate: '2025-01-15T00:00:00.000Z',
            url: 'https://example.com/appf'
        };

        const html = renderToString(<IdeasTable ideas={[mockIdea]} searched={true} lang="en" />);

        // Header check
        expect(html).toMatch(/Ticker.*Company/);
        expect(html).toContain('Summary');
        expect(html).toMatch(/Current Price.*Target Price.*Relevance/);

        // Sub-cell content check
        expect(html).toContain('APPF.US');
        expect(html).toContain('Appfolio Inc');
        expect(html).toContain('$210.00');
        expect(html).toContain('$250 (+19.0%)');
        expect(html).toContain('85%');

        // Bold formatting check for Sector:, Business:, Idea:
        expect(html).toMatch(/<strong[^>]*>Sector:<\/strong>/);
        expect(html).toMatch(/<strong[^>]*>Business:<\/strong>/);
        expect(html).toMatch(/<strong[^>]*>Idea:<\/strong>/);
    });
});
