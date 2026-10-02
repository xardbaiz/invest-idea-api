import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Grid
} from '@mui/material';

interface AnalyticsDiagramsProps {
    ticker?: string;
}

export function AnalyticsDiagrams({ ticker }: AnalyticsDiagramsProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [riskReturnData, setRiskReturnData] = useState<any>(null);
    const [recommendationsData, setRecommendationsData] = useState<any>(null);

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
            fetch(`/api/${encodeURIComponent(ticker)}/risk-return`).then(r => r.ok ? r.json() : null),
            fetch(`/api/${encodeURIComponent(ticker)}/recommendations`).then(r => r.ok ? r.json() : null)
        ])
            .then(([rr, recs]) => {
                if (!isMounted) return;
                setRiskReturnData(rr);
                setRecommendationsData(recs?.recommendations ? recs.recommendations : recs);
                setLoading(false);
            })
            .catch(err => {
                if (!isMounted) return;
                console.error('Error loading analytics diagrams:', err);
                setError('Failed to load analytics diagrams');
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
                {/* Left: Risk / Return Polar Chart */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {renderRiskReturnChart(riskReturnData)}
                </Box>

                {/* Right: Recommendations Donut Chart */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {renderRecommendationsChart(recommendationsData)}
                </Box>
            </Box>
        </Paper>
    );
}

function renderRiskReturnChart(data: any) {
    if (!data) return null;

    const risk = data.risk || {};
    const ret = data.return || {};
    const riskScores = risk.scores || {};
    const returnScores = ret.scores || {};

    // 12 sectors definition matching the prompt image
    const sectors = [
        // Return side (angles -90 to +90 degrees)
        { key: 'dividends', label: 'Dividends', score: returnScores.dividends || 0, side: 'return', startAngle: -90, endAngle: -60 },
        { key: 'growthMom', label: 'Growth (MoM)', score: returnScores.growthMom || 0, side: 'return', startAngle: -60, endAngle: -30 },
        { key: 'valuation', label: 'Valuation', score: returnScores.valuation || 0, side: 'return', startAngle: -30, endAngle: 0 },
        { key: 'analystView', label: 'Analyst view', score: returnScores.analystView || 0, side: 'return', startAngle: 0, endAngle: 30 },
        { key: 'performance', label: 'Performance', score: returnScores.performance || 0, side: 'return', startAngle: 30, endAngle: 60 },
        { key: 'profitability', label: 'Profitability', score: returnScores.profitability || 0, side: 'return', startAngle: 60, endAngle: 90 },

        // Risk side (angles +90 to +270 degrees)
        { key: 'other', label: 'Other', score: riskScores.other || 0, side: 'risk', startAngle: 90, endAngle: 120 },
        { key: 'solvency', label: 'Solvency', score: riskScores.solvency || 0, side: 'risk', startAngle: 120, endAngle: 150 },
        { key: 'liquidity', label: 'Liquidity', score: riskScores.liquidity || 0, side: 'risk', startAngle: 150, endAngle: 180 },
        { key: 'stressTest', label: 'Stress Test', score: riskScores.stressTest || 0, side: 'risk', startAngle: 180, endAngle: 210 },
        { key: 'volatility', label: 'Volatility', score: riskScores.volatility || 0, side: 'risk', startAngle: 210, endAngle: 240 },
        { key: 'countryRisk', label: 'Country Risk', score: riskScores.countryRisk || 0, side: 'risk', startAngle: 240, endAngle: 270 }
    ];

    const width = 360;
    const height = 300;
    const cx = 180;
    const cy = 160;
    const maxR = 90;
    const maxScore = 10;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Helper to build SVG wedge path
    const getWedgePath = (startDeg: number, endDeg: number, score: number) => {
        const r = (Math.max(0, Math.min(score, maxScore)) / maxScore) * maxR;
        if (r <= 0) return '';

        const a1 = toRad(startDeg);
        const a2 = toRad(endDeg);

        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const x2 = cx + r * Math.cos(a2);
        const y2 = cy + r * Math.sin(a2);

        const largeArc = endDeg - startDeg > 180 ? 1 : 0;

        return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    return (
        <Box sx={{ width: '100%', maxWidth: width, position: 'relative' }}>
            {/* Headers */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 2 }}>
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

            {/* SVG Chart */}
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Left Background Tint (Risk) */}
                <path
                    d={`M ${cx} ${cy - maxR} A ${maxR} ${maxR} 0 0 0 ${cx} ${cy + maxR} Z`}
                    fill="#fdeded"
                    opacity="0.6"
                />
                {/* Right Background Tint (Return) */}
                <path
                    d={`M ${cx} ${cy - maxR} A ${maxR} ${maxR} 0 0 1 ${cx} ${cy + maxR} Z`}
                    fill="#edf7ed"
                    opacity="0.6"
                />

                {/* Grid circles */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={maxR * ratio}
                        fill="none"
                        stroke="#e0e0e0"
                        strokeDasharray={ratio === 1 ? 'none' : '2,2'}
                    />
                ))}

                {/* Sector divider lines */}
                {sectors.map((s, i) => {
                    const rad = toRad(s.startAngle);
                    const x = cx + maxR * Math.cos(rad);
                    const y = cy + maxR * Math.sin(rad);
                    return (
                        <line
                            key={i}
                            x1={cx}
                            y1={cy}
                            x2={x}
                            y2={y}
                            stroke="#e0e0e0"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Center vertical line */}
                <line x1={cx} y1={cy - maxR - 10} x2={cx} y2={cy + maxR + 10} stroke="#cccccc" strokeWidth="1.5" />

                {/* Wedges */}
                {sectors.map((s, i) => {
                    const path = getWedgePath(s.startAngle, s.endAngle, s.score);
                    if (!path) return null;
                    const fill = s.side === 'risk' ? '#ef5350' : '#4caf50';
                    return <path key={i} d={path} fill={fill} opacity="0.85" />;
                })}

                {/* Labels */}
                {sectors.map((s, i) => {
                    const midAngle = (s.startAngle + s.endAngle) / 2;
                    const rad = toRad(midAngle);
                    const labelR = maxR + 24;
                    const x = cx + labelR * Math.cos(rad);
                    const y = cy + labelR * Math.sin(rad);

                    let textAnchor: 'start' | 'end' | 'middle' = 'middle';
                    if (Math.cos(rad) > 0.2) textAnchor = 'start';
                    if (Math.cos(rad) < -0.2) textAnchor = 'end';

                    return (
                        <text
                            key={i}
                            x={x}
                            y={y + 4}
                            textAnchor={textAnchor}
                            fontSize="10px"
                            fontWeight="500"
                            fill="#555555"
                        >
                            {s.label}
                        </text>
                    );
                })}
            </svg>
        </Box>
    );
}

function renderRecommendationsChart(data: any) {
    if (!data) return null;

    const title = data.title || 'Recommendations';
    const text = data.text || '';
    const items: Array<{ id: string; title: string; color: string; raw: number }> = data.items || [];

    const total = items.reduce((sum, item) => sum + (item.raw || 0), 0);

    const colorMap: Record<string, string> = {
        green: '#2e7d32',
        lightgreen: '#4caf50',
        gray: '#9e9e9e',
        grey: '#9e9e9e',
        yellow: '#fbc02d',
        red: '#e53935'
    };

    const width = 260;
    const height = 180;
    const cx = 130;
    const cy = 90;
    const outerR = 65;
    const innerR = 38;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    let currentAngle = -90; // Start at top

    const slices = items.map(item => {
        const raw = item.raw || 0;
        const angleSpan = total > 0 ? (raw / total) * 360 : 0;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angleSpan;
        currentAngle = endAngle;

        const color = colorMap[item.color] || item.color || '#9e9e9e';

        return {
            ...item,
            startAngle,
            endAngle,
            color
        };
    });

    const getDonutSlicePath = (startDeg: number, endDeg: number) => {
        if (endDeg - startDeg >= 360) {
            endDeg = startDeg + 359.99;
        }

        const a1 = toRad(startDeg);
        const a2 = toRad(endDeg);

        const x1Out = cx + outerR * Math.cos(a1);
        const y1Out = cy + outerR * Math.sin(a1);
        const x2Out = cx + outerR * Math.cos(a2);
        const y2Out = cy + outerR * Math.sin(a2);

        const x1In = cx + innerR * Math.cos(a2);
        const y1In = cy + innerR * Math.sin(a2);
        const x2In = cx + innerR * Math.cos(a1);
        const y2In = cy + innerR * Math.sin(a1);

        const largeArc = endDeg - startDeg > 180 ? 1 : 0;

        return `M ${x1Out} ${y1Out} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2Out} ${y2Out} L ${x1In} ${y1In} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2In} ${y2In} Z`;
    };

    return (
        <Box sx={{ width: '100%', maxWidth: width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

            {/* Donut SVG */}
            {total > 0 && (
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {slices.map((slice, i) => {
                        const path = getDonutSlicePath(slice.startAngle, slice.endAngle);
                        return <path key={i} d={path} fill={slice.color} stroke="#ffffff" strokeWidth="2" />;
                    })}
                </svg>
            )}

            {/* Legend / Items row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 1 }}>
                {items.map((item, i) => (
                    <Typography key={i} variant="caption" sx={{ fontWeight: 600, color: '#333' }}>
                        {item.title} - {item.raw}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
}
