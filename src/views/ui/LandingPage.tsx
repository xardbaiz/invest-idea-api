import { Language, getTranslations } from './i18n/i18n.js';
import {
    Box as MuiBox,
    Container as MuiContainer,
    Typography as MuiTypography,
    Button as MuiButton,
    Grid as MuiGrid,
    Card as MuiCard,
    CardContent as MuiCardContent,
    Chip as MuiChip,
    Paper as MuiPaper,
    Link as MuiLink,
    Divider as MuiDivider,
    Stack as MuiStack
} from '@mui/material';

const Box = MuiBox as any;
const Container = MuiContainer as any;
const Typography = MuiTypography as any;
const Button = MuiButton as any;
const Grid = MuiGrid as any;
const Card = MuiCard as any;
const CardContent = MuiCardContent as any;
const Chip = MuiChip as any;
const Paper = MuiPaper as any;
const Link = MuiLink as any;
const Divider = MuiDivider as any;
const Stack = MuiStack as any;

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
            minHeight: '100vh'
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
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
                        </Stack>

                        <Stack direction="row" spacing={3} alignItems="center" component="nav">
                            <Link href="/" underline="none" sx={{ color: '#dae2fd', fontSize: '0.9rem', fontWeight: 500 }}>{t.navHome}</Link>
                            <Link href="/ideas" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500 }}>{t.navIdeas}</Link>
                            <Link href="#pipeline" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500 }}>{t.navPipeline}</Link>
                            <Link href="#about" underline="none" sx={{ color: '#bbcabf', fontSize: '0.9rem', fontWeight: 500 }}>{t.navAbout}</Link>
                            <Button
                                component="a"
                                href="/ideas"
                                variant="contained"
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
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" component="section" sx={{ pt: 10, pb: 8, textAlign: 'center' }}>
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
                    fontSize: { xs: '2.2rem', md: '3.2rem' },
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

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                    <Button
                        component="a"
                        href="/ideas"
                        variant="contained"
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
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    <Box component="span" className="material-icons" sx={{ color: '#10b981', fontSize: 18 }}>
                        verified
                    </Box>
                    <Typography component="span" variant="body2" sx={{ color: '#94a3b8' }}>
                        {t.heroStatus}
                    </Typography>
                </Stack>
            </Container>

            {/* Metrics Section */}
            <Container maxWidth="lg" component="section" sx={{ mb: 10 }}>
                <Grid container spacing={2.5}>
                    {[
                        { val: t.stat1Value, lbl: t.stat1Label },
                        { val: t.stat2Value, lbl: t.stat2Label },
                        { val: t.stat3Value, lbl: t.stat3Label },
                        { val: t.stat4Value, lbl: t.stat4Label },
                    ].map((st, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Paper sx={{
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
                        </Grid>
                    ))}
                </Grid>
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

                    <Paper sx={{
                        backgroundColor: '#0a111a',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        p: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                <Box component="span" className="material-icons" sx={{ fontSize: 16, color: '#10b981' }}>sync</Box>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>finance.xardbaiz.im / vector-search-preview (200 OK)</Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Qdrant Cosine Similarity</Typography>
                        </Box>

                        <Paper sx={{
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

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper sx={{
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
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Paper sx={{
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
                            </Grid>
                        </Grid>

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

                <Grid container spacing={3}>
                    {[
                        { icon: 'cloud_download', step: '01', title: t.step1Title, sub: t.step1Sub, desc: t.step1Desc, tag: t.step1Tag },
                        { icon: 'psychology', step: '02', title: t.step2Title, sub: t.step2Sub, desc: t.step2Desc, tag: t.step2Tag },
                        { icon: 'sell', step: '03', title: t.step3Title, sub: t.step3Sub, desc: t.step3Desc, tag: t.step3Tag },
                        { icon: 'hub', step: '04', title: t.step4Title, sub: t.step4Sub, desc: t.step4Desc, tag: t.step4Tag }
                    ].map((step, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card sx={{
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
                        </Grid>
                    ))}
                </Grid>
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

                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ backgroundColor: '#171f33', p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                                    <Box component="span" className="material-icons">verified_user</Box>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{t.aboutFeat1Title}</Typography>
                                </Stack>
                                <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat1Desc}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ backgroundColor: '#171f33', p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#ffb95f', fontWeight: 600, mb: 1 }}>
                                    <Box component="span" className="material-icons">dataset</Box>
                                    <Typography sx={{ color: '#ffb95f', fontWeight: 600 }}>{t.aboutFeat2Title}</Typography>
                                </Stack>
                                <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat2Desc}</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ backgroundColor: '#171f33', p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                                    <Box component="span" className="material-icons">manage_search</Box>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{t.aboutFeat3Title}</Typography>
                                </Stack>
                                <Typography sx={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat3Desc}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', mb: 2 }}>{t.techStackTitle}</Typography>
                        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
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
                        </Stack>
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
                    <Grid container spacing={5} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', mb: 1.5 }}>
                                <Box component="span" className="material-icons" sx={{ color: '#10b981' }}>insights</Box>
                                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>{t.brandName}</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#bbcabf' }}>
                                {t.footerTagline}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography sx={{ color: '#ffffff', fontWeight: 600, mb: 1.5 }}>{t.footerNavTitle}</Typography>
                            <Stack spacing={1}>
                                <Link href="/" underline="none" sx={{ color: '#bbcabf' }}>{t.navHome}</Link>
                                <Link href="/ideas" underline="none" sx={{ color: '#bbcabf' }}>{t.navIdeas}</Link>
                                <Link href="#pipeline" underline="none" sx={{ color: '#bbcabf' }}>{t.navPipeline}</Link>
                                <Link href="#about" underline="none" sx={{ color: '#bbcabf' }}>{t.navAbout}</Link>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
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
                        </Grid>
                    </Grid>

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
