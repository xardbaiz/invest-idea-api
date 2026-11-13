import React from 'react';
import { Box, Typography } from '@mui/material';
import { getTranslations, Language } from './i18n/i18n.js';

interface HeaderProps {
    lang?: Language;
}

export function Header({ lang = 'en' }: HeaderProps) {
    const t = getTranslations(lang);
    return (
        <Box sx={{ textAlign: 'center', my: { xs: 3, md: 4 } }}>
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                    fontWeight: 500,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    color: '#ffffff'
                }}
            >
                <Box component="span" className="material-icons" sx={{ fontSize: '36px', color: '#1976d2' }}>
                    lightbulb
                </Box>
                {t.ideasPageTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: '#cfcfcf', fontSize: '1rem' }}>
                {t.ideasPageSubtitle}
            </Typography>
        </Box>
    );
}
