import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress
} from '@mui/material';
import { IdeaRow, IdeaItem } from './IdeaRow.js';
import { Language, getTranslations } from './i18n/i18n.js';

interface IdeasTableProps {
    ideas: IdeaItem[];
    searched?: boolean;
    loading?: boolean;
    lang?: Language;
}

export function IdeasTable({ ideas, searched = false, loading = false, lang = 'en' }: IdeasTableProps) {
    const t = getTranslations(lang);

    if (loading) {
        return (
            <Paper
                elevation={1}
                sx={{
                    borderRadius: '12px',
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                <CircularProgress size={36} />
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#555' }}>
                    {lang === 'ru' ? 'Загрузка идей...' : 'Loading ideas...'}
                </Typography>
            </Paper>
        );
    }

    if (!searched) {
        return (
            <Paper
                elevation={1}
                sx={{
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
            >
                <Typography variant="body1" sx={{ color: '#555' }}>
                    {t.tablePromptInitial || t.ideasSearchInitialPrompt}
                </Typography>
            </Paper>
        );
    }

    if (ideas.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#fff8e1',
                    border: '1px solid #ffeba2'
                }}
            >
                <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1, fontWeight: 600, color: '#856404' }}>
                    {t.tableNoResultsTitle || t.noIdeasFoundTitle}
                </Typography>
                <Typography variant="body2" sx={{ color: '#856404' }}>
                    {t.tableNoResultsText || t.noIdeasFoundDesc}
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={1}
            sx={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '100%'
            }}
        >
            <Table sx={{ width: '100%' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                        <TableCell
                            sx={{
                                width: '50%',
                                py: 1.5,
                                px: 1.25,
                                color: '#555',
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.04em'
                            }}
                        >
                            {t.thTicker} / {t.thCompany}
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                width: '50%',
                                py: 1.5,
                                px: 1.25,
                                color: '#555',
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.04em'
                            }}
                        >
                            {t.thCurrentPrice} / {t.thTargetPrice} / {t.thRelevance}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ideas.map((idea, index) => (
                        <IdeaRow key={index} idea={idea} index={index} lang={lang} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
