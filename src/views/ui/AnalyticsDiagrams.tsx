import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from '@mui/x-charts/RadarChart';

interface AnalyticsDiagramsProps {
    ticker?: string;
    onDataLoaded?: (status: 'success' | 'error' | 'nodata') => void;
}

function useAnimationProgress(duration = 850) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const p = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(eased);

            if (p < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [duration]);

    return progress;
}

export function AnalyticsDiagrams({ ticker, onDataLoaded }: AnalyticsDiagramsProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [riskReturnData, setRiskReturnData] = useState<any>(null);
    const [recommendationsData, setRecommendationsData] = useState<any>(null);

    const animationProgress = useAnimationProgress(850);

    useEffect(() => {
        if (!ticker) {
            setLoading(false);
            setError('No ticker provided');
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        Promise.all([
            fetch(`/api/${encodeURIComponent(ticker)}/risk-return`).then(async r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const res = await r.json();
                if (res?.error) throw new Error(res.error);
                return res;
            }),
            fetch(`/api/${encodeURIComponent(ticker)}/recommendations`).then(async r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const res = await r.json();
                if (res?.error) throw new Error(res.error);
                return res;
            })
        ])
            .then(([rr, recs]) => {
                if (!isMounted) return;
                const recData = recs?.recommendations ? recs.recommendations : recs;

                // Check if data is completely empty/zero
                const riskScores = Object.values(rr?.risk?.scores || {});
                const returnScores = Object.values(rr?.return?.scores || {});
                const hasScores = riskScores.some(v => typeof v === 'number' && v > 0) || returnScores.some(v => typeof v === 'number' && v > 0);
                const recItems = recData?.items || [];
                const hasRecs = recItems.some((item: any) => typeof item.raw === 'number' && item.raw > 0);

                if (!hasScores && !hasRecs) {
                    onDataLoaded?.('nodata');
                } else {
                    setRiskReturnData(rr);
                    setRecommendationsData(recData);
                    onDataLoaded?.('success');
                }
                setLoading(false);
            })
            .catch(err => {
                if (!isMounted) return;
                console.error('Error loading analytics diagrams:', err);
                setError('Failed to load analytics diagrams');
                onDataLoaded?.('error');
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [ticker]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, gap: 2 }}>
                <CircularProgress size={28} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                    Loading analytics data for {ticker}...
                </Typography>
            </Box>
        );
    }

    if (error || (!riskReturnData && !recommendationsData)) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="error">
                    {error || 'Analytics data unavailable'}
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                my: 1,
                backgroundColor: '#fafafa',
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                    gap: 3
                }}
            >
                {/* Left: Risk / Return Radar Chart */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {renderRiskReturnChart(riskReturnData, animationProgress)}
                </Box>

                {/* Right: Recommendations Donut Chart */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {renderRecommendationsChart(recommendationsData)}
                </Box>
            </Box>
        </Paper>
    );
}

function renderRiskReturnChart(data: any, animationProgress: number) {
    if (!data) return null;

    const risk = data.risk || {};
    const ret = data.return || {};
    const riskScores = risk.scores || {};
    const returnScores = ret.scores || {};

    const categories = [
        { key: 'dividends', label: 'Dividends', value: returnScores.dividends || 0, series: 'return' },
        { key: 'growthMom', label: 'Growth (MoM)', value: returnScores.growthMom || 0, series: 'return' },
        { key: 'valuation', label: 'Valuation', value: returnScores.valuation || 0, series: 'return' },
        { key: 'analystView', label: 'Analyst view', value: returnScores.analystView || 0, series: 'return' },
        { key: 'performance', label: 'Performance', value: returnScores.performance || 0, series: 'return' },
        { key: 'profitability', label: 'Profitability', value: returnScores.profitability || 0, series: 'return' },
        { key: 'other', label: 'Other', value: riskScores.other || 0, series: 'risk' },
        { key: 'solvency', label: 'Solvency', value: riskScores.solvency || 0, series: 'risk' },
        { key: 'liquidity', label: 'Liquidity', value: riskScores.liquidity || 0, series: 'risk' },
        { key: 'stressTest', label: 'Stress Test', value: riskScores.stressTest || 0, series: 'risk' },
        { key: 'volatility', label: 'Volatility', value: riskScores.volatility || 0, series: 'risk' },
        { key: 'countryRisk', label: 'Country Risk', value: riskScores.countryRisk || 0, series: 'risk' }
    ];

    const metrics = categories.map(c => c.label);

    const riskData = categories.map(c => (c.series === 'risk' ? c.value * animationProgress : 0));
    const returnData = categories.map(c => (c.series === 'return' ? c.value * animationProgress : 0));

    return (
        <Box sx={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Headers */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1, px: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ color: '#e53935', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>
                        Risk
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                        {risk.characteristic || '—'}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>
                        Return
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                        {ret.characteristic || '—'}
                    </Typography>
                </Box>
            </Box>

            <RadarChart
                height={280}
                width={360}
                radar={{
                    metrics,
                    max: 10
                }}
                series={[
                    {
                        label: 'Return',
                        data: returnData,
                        color: '#4caf50',
                        fillArea: true,
                        valueFormatter: (_val: number | null, context: { dataIndex: number }) => {
                            const cat = categories[context.dataIndex];
                            if (!cat || cat.series !== 'return' || !cat.value) return null;
                            return `${cat.label}: ${cat.value}`;
                        }
                    },
                    {
                        label: 'Risk',
                        data: riskData,
                        color: '#ef5350',
                        fillArea: true,
                        valueFormatter: (_val: number | null, context: { dataIndex: number }) => {
                            const cat = categories[context.dataIndex];
                            if (!cat || cat.series !== 'risk' || !cat.value) return null;
                            return `${cat.label}: ${cat.value}`;
                        }
                    }
                ]}
                sx={{
                    '& .MuiRadarChart-seriesArea': {
                        fillOpacity: 0.45
                    }
                }}
            />
        </Box>
    );
}

function renderRecommendationsChart(data: any) {
    if (!data) return null;

    const title = data.title || 'Recommendations';
    const text = data.text || '';
    const items: Array<{ id: string; title: string; color: string; raw: number }> = data.items || [];

    const colorMap: Record<string, string> = {
        green: '#2e7d32',
        lightgreen: '#4caf50',
        gray: '#9e9e9e',
        grey: '#9e9e9e',
        yellow: '#fbc02d',
        red: '#e53935'
    };

    const pieData = items.map((item, index) => ({
        id: item.id || `item-${index}`,
        value: item.raw || 0,
        label: `${item.title} (${item.raw})`,
        color: colorMap[item.color] || item.color || '#9e9e9e'
    }));

    return (
        <Box sx={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Title */}
            <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 0.5, textAlign: 'center' }}>
                {title}
            </Typography>

            {/* Subtitle */}
            {text && (
                <Typography variant="caption" sx={{ color: '#666', mb: 1, textAlign: 'center', display: 'block' }}>
                    {text}
                </Typography>
            )}

            <PieChart
                height={220}
                width={300}
                series={[
                    {
                        data: pieData,
                        innerRadius: 40,
                        outerRadius: 85,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
                    }
                ]}
            />
        </Box>
    );
}
