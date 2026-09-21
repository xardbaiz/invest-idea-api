import {getTranslations, Language} from './i18n/i18n.js';
import {Box, Button, Card, CardContent, Chip, Container, Divider, Link, Paper, Typography} from '@mui/material';

interface LandingPageProps {
    lang?: Language;
}

export function LandingPage({ lang = 'en' }: LandingPageProps) {
    const t = getTranslations(lang);

    return (
        <Box sx={{
            backgroundColor: '#0b1326',
            color: '#dae2fd',
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            minHeight: '100vh',
            margin: 0,
            padding: 0
        }}>
            {/* Header Navigation */}
            <Box component="header" sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(11, 19, 38, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{
                        py: 2,
                        px: { xs: 1, sm: 2 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box component="span" className="material-icons" sx={{ color: '#10b981', fontSize: 28 }}>
                                insights
                            </Box>
                            <Box>
                                <Typography component="span" sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                                    {t.brandName}
                                </Typography>
                                <Chip
                                    label="AI Pipeline: Active"
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        fontSize: '0.75rem',
                                        color: '#10b981',
                                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        height: 22
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box component="nav" sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 }, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Link href="/" underline="none" sx={{ color: '#dae2fd', fontSize: '0.9rem', fontWeight: 500 }}>{t.navHome}</Link>
                            <Link href="/ideas" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500 }}>{t.navIdeas}</Link>
                            <Link href="#pipeline" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500 }}>{t.navPipeline}</Link>
                            <Link href="#about" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500 }}>{t.navAbout}</Link>
                            <Button
                                component="a"
                                href="/ideas"
                                variant="contained"
                                disableElevation
                                sx={{
                                    backgroundColor: '#10b981',
                                    color: '#05080e',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 2.2,
                                    py: 1,
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                                    '&:hover': { backgroundColor: '#34d399' }
                                }}
                                endIcon={<Box component="span" className="material-icons" sx={{ fontSize: 16 }}>trending_flat</Box>}
                            >
                                {t.ctaExploreIdeas}
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" component="section" sx={{ pt: { xs: 6, md: 10 }, pb: 8, textAlign: 'center' }}>
                <Chip
                    icon={<Box component="span" className="material-icons" sx={{ fontSize: '18px !important', color: '#34d399' }}>bolt</Box>}
                    label={t.heroBadge}
                    sx={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        color: '#34d399',
                        fontWeight: 600,
                        mb: 3,
                        px: 1,
                        py: 2
                    }}
                />

                <Typography variant="h1" sx={{
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                    fontWeight: 700,
                    lineHeight: 1.15,
                    mb: 2.5,
                    color: '#ffffff',
                    letterSpacing: '-0.03em'
                }}>
                    {t.heroTitle}
                </Typography>

                <Typography sx={{
                    fontSize: '1.15rem',
                    lineHeight: 1.6,
                    color: '#bbcabf',
                    maxWidth: 840,
                    mx: 'auto',
                    mb: 4.5
                }}>
                    {t.heroSubtitle}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                    <Button
                        component="a"
                        href="/ideas"
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: '#10b981',
                            color: '#05080e',
                            py: 1.75,
                            px: 3.5,
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)',
                            '&:hover': { backgroundColor: '#34d399' }
                        }}
                        endIcon={<Box component="span" className="material-icons" sx={{ fontSize: 20 }}>trending_flat</Box>}
                    >
                        {t.heroBtnSearch}
                    </Button>
                    <Button
                        component="a"
                        href="#pipeline"
                        variant="outlined"
                        sx={{
                            backgroundColor: 'rgba(16, 27, 39, 0.7)',
                            color: '#f8fafc',
                            py: 1.75,
                            px: 3.5,
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderColor: 'rgba(255, 255, 255, 0.12)',
                            '&:hover': { borderColor: 'rgba(16, 185, 129, 0.5)', backgroundColor: 'rgba(16, 185, 129, 0.08)' }
                        }}
                        endIcon={<Box component="span" className="material-icons" sx={{ fontSize: 20 }}>south</Box>}
                    >
                        {t.heroBtnPipeline}
                    </Button>
                </Box>

                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#94a3b8', fontSize: '0.875rem' }}>
                    <Box component="span" className="material-icons" sx={{ color: '#10b981', fontSize: 18 }}>
                        verified
                    </Box>
                    <Typography component="span" variant="body2" sx={{ color: '#94a3b8' }}>
                        {t.heroStatus}
                    </Typography>
                </Box>
            </Container>

            {/* Metrics Section */}
            <Container maxWidth="lg" component="section" sx={{ mb: 10 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: 2.5
                }}>
                    {[
                        {val: '1251', lbl: t.stat1Label},
                        {val: '15+', lbl: t.stat2Label},
                        {val: '99.4%', lbl: t.stat3Label},
                        { val: t.stat4Value, lbl: t.stat4Label },
                    ].map((st, i) => (
                        <Paper key={i} elevation={0} sx={{
                            backgroundColor: '#171f33',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            p: 3,
                            textAlign: 'center'
                        }}>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', mb: 0.75 }}>
                                {st.val}
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: '#bbcabf' }}>
                                {st.lbl}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Container>

            {/* Interactive Search Preview */}
            <Box component="section" sx={{
                backgroundColor: '#131b2e',
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
                            {t.previewBadge}
                        </Typography>
                        <Typography variant="h2" sx={{ fontSize: '2.25rem', fontWeight: 700, mb: 2, color: '#ffffff' }}>
                            {t.previewTitle}
                        </Typography>
                        <Typography sx={{ color: '#bbcabf', fontSize: '1rem', maxWidth: 700, mx: 'auto' }}>
                            {t.previewSubtitle}
                        </Typography>
                    </Box>

                    <Paper elevation={0} sx={{
                        backgroundColor: '#0a111a',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        p: { xs: 2.5, sm: 4 },
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            flexWrap: 'wrap',
                            gap: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                                <Box component="span" className="material-icons" sx={{ fontSize: 16, color: '#10b981' }}>sync</Box>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>finance.xardbaiz.im / vector-search-preview (200 OK)</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Qdrant Cosine Similarity</Typography>
                        </Box>

                        <Paper elevation={0} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            backgroundColor: '#131b2e',
                            borderRadius: '8px',
                            p: 2,
                            mb: 3,
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                            <Box component="span" className="material-icons" sx={{ color: '#10b981' }}>search</Box>
                            <Typography sx={{ color: '#ffffff', fontWeight: 500 }}>{t.previewSearchInput}</Typography>
                        </Paper>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                            <Paper elevation={0} sx={{
                                backgroundColor: '#171f33',
                                borderRadius: '12px',
                                p: 2.5,
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography sx={{ fontWeight: 700, color: '#ffffff' }}>YOU.US</Typography>
                                    <Chip label={t.previewMatch79} size="small" sx={{ fontSize: '0.75rem', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)' }} />
                                </Box>
                                <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem', mb: 1.5 }}>Clear Secure Inc</Typography>
                                <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>{t.previewTargetUpside1}</Typography>
                            </Paper>

                            <Paper elevation={0} sx={{
                                backgroundColor: '#171f33',
                                borderRadius: '12px',
                                p: 2.5,
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography sx={{ fontWeight: 700, color: '#ffffff' }}>ADBE.US</Typography>
                                    <Chip label={t.previewMatch79} size="small" sx={{ fontSize: '0.75rem', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)' }} />
                                </Box>
                                <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem', mb: 1.5 }}>Adobe Systems Inc</Typography>
                                <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>{t.previewTargetUpside2}</Typography>
                            </Paper>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Link href="/ideas" underline="none" sx={{
                                color: '#10b981',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75
                            }}>
                                {t.previewCatalogBtn}
                                <Box component="span" className="material-icons" sx={{ fontSize: 18 }}>arrow_forward</Box>
                            </Link>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* Pipeline Steps */}
            <Container maxWidth="lg" component="section" id="pipeline" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 7 }}>
                    <Typography variant="overline" sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: '#10b981',
                        display: 'block',
                        mb: 1.5
                    }}>
                        {t.pipelineBadge}
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: '2.25rem', fontWeight: 700, mb: 2, color: '#ffffff' }}>
                        {t.pipelineTitle}
                    </Typography>
                    <Typography sx={{ color: '#bbcabf', fontSize: '1rem', maxWidth: 750, mx: 'auto' }}>
                        {t.pipelineSubtitle}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: 3
                }}>
                    {[
                        { icon: 'cloud_download', step: '01', title: t.step1Title, sub: t.step1Sub, desc: t.step1Desc, tag: t.step1Tag },
                        { icon: 'psychology', step: '02', title: t.step2Title, sub: t.step2Sub, desc: t.step2Desc, tag: t.step2Tag },
                        { icon: 'sell', step: '03', title: t.step3Title, sub: t.step3Sub, desc: t.step3Desc, tag: t.step3Tag },
                        { icon: 'hub', step: '04', title: t.step4Title, sub: t.step4Sub, desc: t.step4Desc, tag: t.step4Tag }
                    ].map((step, idx) => (
                        <Card key={idx} elevation={0} sx={{
                            backgroundColor: '#171f33',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                    <Box component="span" className="material-icons" sx={{ fontSize: 32, color: '#10b981' }}>{step.icon}</Box>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Step {step.step}</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', mb: 0.5 }}>{step.title}</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 500, mb: 2 }}>{step.sub}</Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: '#bbcabf', lineHeight: 1.5, mb: 2.5 }}>{step.desc}</Typography>
                                <Chip label={step.tag} size="small" sx={{ fontSize: '0.75rem', color: '#95d3ba', backgroundColor: '#0b513d', fontWeight: 600 }} />
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>

            {/* About & Transparency */}
            <Box component="section" id="about" sx={{
                backgroundColor: '#131b2e',
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
                            {['Node.js', 'Preact', 'Material UI', 'Qdrant', 'OpenAI', 'Supabase'].map((st, i) => (
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
