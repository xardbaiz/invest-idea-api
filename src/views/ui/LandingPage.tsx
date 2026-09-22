import React from 'react';
import { Box, Container, Typography, Button, Paper, Chip, Link, Divider } from '@mui/material';
import { Language, getTranslations } from './i18n/i18n.js';

interface LandingPageProps {
    lang?: Language;
}

export function LandingPage({ lang = 'en' }: LandingPageProps) {
    const t = getTranslations(lang);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#0b1326', color: '#dae2fd' }}>
            {/* Header / Nav */}
            <Box component="header" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', py: 2 }}>
                <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="span" className="material-icons" sx={{ color: '#10b981', fontSize: 28 }}>insights</Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                            {t.brandName}
                        </Typography>
                    </Box>
                    <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
                        <Link href="#features" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500, '&:hover': { color: '#ffffff' } }}>
                            {t.navPipeline}
                        </Link>
                        <Link href="#about" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500, '&:hover': { color: '#ffffff' } }}>
                            {t.navAbout}
                        </Link>
                        <Button
                            component="a"
                            href="/ideas"
                            variant="contained"
                            disableElevation
                            sx={{
                                backgroundColor: '#10b981',
                                color: '#05080e',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 2.5,
                                '&:hover': { backgroundColor: '#34d399' }
                            }}
                        >
                            {t.navIdeas}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="md" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Chip
                    label={t.heroBadge}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 3
                    }}
                />
                <Typography variant="h1" sx={{
                    fontSize: { xs: '2.5rem', md: '3.75rem' },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: '#ffffff',
                    mb: 3,
                    letterSpacing: '-0.03em'
                }}>
                    {t.heroTitle}
                </Typography>
                <Typography sx={{
                    fontSize: { xs: '1.05rem', md: '1.25rem' },
                    color: '#bbcabf',
                    lineHeight: 1.6,
                    mb: 5,
                    maxWidth: 720,
                    mx: 'auto'
                }}>
                    {t.heroSubtitle}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        component="a"
                        href="/ideas"
                        variant="contained"
                        disableElevation
                        size="large"
                        sx={{
                            backgroundColor: '#10b981',
                            color: '#05080e',
                            fontWeight: 700,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3.5,
                            py: 1.5,
                            '&:hover': { backgroundColor: '#34d399' }
                        }}
                        endIcon={<Box component="span" className="material-icons">arrow_forward</Box>}
                    >
                        {t.heroCtaPrimary}
                    </Button>
                    <Button
                        component="a"
                        href="#pipeline"
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            py: 1.5,
                            '&:hover': { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.05)' }
                        }}
                    >
                        {t.heroCtaSecondary}
                    </Button>
                </Box>
            </Container>

            {/* Stats Bar */}
            <Box sx={{ backgroundColor: '#131c31', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', py: 4 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, textAlign: 'center' }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981', fontSize: '2.25rem' }}>10,000+</Typography>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.875rem', mt: 0.5 }}>{t.stat1Label}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffb95f', fontSize: '2.25rem' }}>&lt; 50ms</Typography>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.875rem', mt: 0.5 }}>{t.stat2Label}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981', fontSize: '2.25rem' }}>98.4%</Typography>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.875rem', mt: 0.5 }}>{t.stat3Label}</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Pipeline Section */}
            <Box id="pipeline" sx={{ py: 10 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', color: '#10b981', display: 'block', mb: 1.5 }}>
                            {t.pipelineBadge}
                        </Typography>
                        <Typography variant="h2" sx={{ fontSize: '2.25rem', fontWeight: 700, mb: 2, color: '#ffffff' }}>
                            {t.pipelineTitle}
                        </Typography>
                        <Typography sx={{ color: '#bbcabf', fontSize: '1rem', maxWidth: 680, mx: 'auto' }}>
                            {t.pipelineSubtitle}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 4, borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 700 }}>1</Box>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>{t.step1Title}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.925rem', lineHeight: 1.6 }}>{t.step1Desc}</Typography>
                        </Paper>

                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 4, borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(255, 185, 95, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb95f', fontWeight: 700 }}>2</Box>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>{t.step2Sub}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.925rem', lineHeight: 1.6 }}>{t.step2Desc}</Typography>
                        </Paper>

                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 4, borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 700 }}>3</Box>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>{t.step3Sub}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.925rem', lineHeight: 1.6 }}>{t.step3Desc}</Typography>
                        </Paper>

                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 4, borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(255, 185, 95, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb95f', fontWeight: 700 }}>4</Box>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>{t.step4Sub}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.925rem', lineHeight: 1.6 }}>{t.step4Desc}</Typography>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* About / Tech Section */}
            <Box id="about" sx={{
                backgroundColor: '#0a1120',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                py: 10
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="overline" sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            color: '#10b981',
                            display: 'block',
                            mb: 1.5
                        }}>
                            {t.aboutBadge}
                        </Typography>
                        <Typography variant="h2" sx={{ fontSize: '2.25rem', fontWeight: 700, mb: 2, color: '#ffffff' }}>
                            {t.aboutTitle}
                        </Typography>
                        <Typography sx={{ color: '#bbcabf', fontSize: '1rem', maxWidth: 800, mx: 'auto' }}>
                            {t.aboutSubtitle}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981', fontWeight: 600, mb: 1 }}>
                                <Box component="span" className="material-icons">verified_user</Box>
                                <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{t.aboutFeat1Title}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat1Desc}</Typography>
                        </Paper>

                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffb95f', fontWeight: 600, mb: 1 }}>
                                <Box component="span" className="material-icons">dataset</Box>
                                <Typography sx={{ color: '#ffb95f', fontWeight: 600 }}>{t.aboutFeat2Title}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat2Desc}</Typography>
                        </Paper>

                        <Paper elevation={0} sx={{ backgroundColor: '#171f33', p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981', fontWeight: 600, mb: 1 }}>
                                <Box component="span" className="material-icons">manage_search</Box>
                                <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{t.aboutFeat3Title}</Typography>
                            </Box>
                            <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat3Desc}</Typography>
                        </Paper>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', mb: 2 }}>{t.techStackTitle}</Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Node.js', 'React', 'Material UI', 'Qdrant', 'OpenAI', 'Supabase'].map((st, i) => (
                                <Chip
                                    key={i}
                                    label={st}
                                    sx={{
                                        backgroundColor: '#0a111a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#ffffff',
                                        fontSize: '0.85rem',
                                        fontWeight: 500
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container maxWidth="md" component="section" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', mb: 2 }}>
                    {t.ctaSectionTitle}
                </Typography>
                <Typography sx={{ color: '#bbcabf', fontSize: '1.1rem', mb: 4 }}>
                    {t.ctaSectionSub}
                </Typography>
                <Button
                    component="a"
                    href="/ideas"
                    variant="contained"
                    disableElevation
                    sx={{
                        backgroundColor: '#10b981',
                        color: '#05080e',
                        py: 2,
                        px: 4.5,
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        textTransform: 'none',
                        boxShadow: '0 0 28px rgba(16, 185, 129, 0.4)',
                        '&:hover': { backgroundColor: '#34d399' }
                    }}
                    endIcon={<Box component="span" className="material-icons" sx={{ fontSize: 22 }}>trending_flat</Box>}
                >
                    {t.ctaExploreIdeas}
                </Button>
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{
                backgroundColor: '#060e20',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                pt: 7.5,
                pb: 4,
                color: '#bbcabf',
                fontSize: '0.875rem'
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 5, mb: 6 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', mb: 1.5 }}>
                                <Box component="span" className="material-icons" sx={{ color: '#10b981' }}>insights</Box>
                                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>{t.brandName}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#bbcabf' }}>
                                {t.footerTagline}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography sx={{ color: '#ffffff', fontWeight: 600, mb: 1.5 }}>{t.footerNavTitle}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Link href="/" underline="none" sx={{ color: '#bbcabf' }}>{t.navHome}</Link>
                                <Link href="/ideas" underline="none" sx={{ color: '#bbcabf' }}>{t.navIdeas}</Link>
                                <Link href="#pipeline" underline="none" sx={{ color: '#bbcabf' }}>{t.navPipeline}</Link>
                                <Link href="#about" underline="none" sx={{ color: '#bbcabf' }}>{t.navAbout}</Link>
                            </Box>
                        </Box>

                        <Box>
                            <Typography sx={{ color: '#ffffff', fontWeight: 600, mb: 1.5 }}>{t.footerGithubTitle}</Typography>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#bbcabf', mb: 1.5 }}>
                                {t.footerGithubText}
                            </Typography>
                            <Link
                                href="https://github.com/xardbaiz/invest-idea-api"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{
                                    color: '#10b981',
                                    fontWeight: 600,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.75
                                }}
                            >
                                <Box component="span" className="material-icons" sx={{ fontSize: 18 }}>terminal</Box>
                                {t.githubRepo}
                            </Link>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', mb: 3 }} />

                    <Box sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#64748b' }}>
                            <Box component="strong" sx={{ color: '#ffb95f' }}>{t.disclaimerTitle}:</Box> {t.disclaimerText}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>{t.copyright}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>{t.systemStatus}</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
