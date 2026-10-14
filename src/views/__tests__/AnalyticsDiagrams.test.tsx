import React from 'react';
import { renderToString } from 'react-dom/server';
import { AnalyticsDiagrams } from '../ui/AnalyticsDiagrams.js';

describe('AnalyticsDiagrams Component', () => {
    it('renders initial loading state when rendered server-side', () => {
        const htmlWithTicker = renderToString(<AnalyticsDiagrams ticker="AAPL.US" />);
        expect(htmlWithTicker).toContain('AAPL.US');
        expect(htmlWithTicker).toContain('Loading analytics data for');
    });
});
