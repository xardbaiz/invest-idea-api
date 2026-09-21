import { h } from 'preact';
import { Language, getTranslations } from './i18n/i18n.js';

interface LandingPageProps {
    lang?: Language;
}

export function LandingPage({ lang = 'en' }: LandingPageProps) {
    const t = getTranslations(lang);

    return (
        <div style={{
            backgroundColor: '#0b1326',
            color: '#dae2fd',
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            minHeight: '100vh',
            margin: 0,
            padding: 0
        }}>
            {/* Header Navigation */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(11, 19, 38, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="material-icons" style={{ color: '#10b981', fontSize: '28px' }}>insights</span>
                        <div>
                            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                                {t.brandName}
                            </span>
                            <span style={{
                                marginLeft: '8px',
                                fontSize: '0.75rem',
                                color: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                padding: '2px 8px',
                                borderRadius: '12px'
                            }}>
                                AI Pipeline: Active
                            </span>
                        </div>
                    </div>
                    <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <a href="/" style={{ color: '#dae2fd', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{t.navHome}</a>
                        <a href="/ideas" style={{ color: '#bbcabf', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{t.navIdeas}</a>
                        <a href="#pipeline" style={{ color: '#bbcabf', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{t.navPipeline}</a>
                        <a href="#about" style={{ color: '#bbcabf', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{t.navAbout}</a>
                        <a href="/ideas" style={{
                            backgroundColor: '#10b981',
                            color: '#05080e',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
                        }}>
                            {t.ctaExploreIdeas}
                            <span className="material-icons" style={{ fontSize: '16px' }}>trending_flat</span>
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: '80px 24px 60px 24px',
                maxWidth: '1280px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#34d399',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '24px'
                }}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>bolt</span>
                    {t.heroBadge}
                </div>

                <h1 style={{
                    fontSize: '3.2rem',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    margin: '0 0 20px 0',
                    color: '#ffffff',
                    letterSpacing: '-0.03em'
                }}>
                    {t.heroTitle}
                </h1>

                <p style={{
                    fontSize: '1.15rem',
                    lineHeight: 1.6,
                    color: '#bbcabf',
                    maxWidth: '840px',
                    margin: '0 auto 36px auto'
                }}>
                    {t.heroSubtitle}
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
                    <a href="/ideas" style={{
                        backgroundColor: '#10b981',
                        color: '#05080e',
                        padding: '14px 28px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)'
                    }}>
                        {t.heroBtnSearch}
                        <span className="material-icons" style={{ fontSize: '20px' }}>trending_flat</span>
                    </a>
                    <a href="#pipeline" style={{
                        backgroundColor: 'rgba(16, 27, 39, 0.7)',
                        color: '#f8fafc',
                        padding: '14px 28px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textDecoration: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {t.heroBtnPipeline}
                        <span className="material-icons" style={{ fontSize: '20px' }}>south</span>
                    </a>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.875rem' }}>
                    <span className="material-icons" style={{ color: '#10b981', fontSize: '18px' }}>verified</span>
                    {t.heroStatus}
                </div>
            </section>

            {/* Metrics Section */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto 80px auto',
                padding: '0 24px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px'
                }}>
                    {[
                        { val: t.stat1Value, lbl: t.stat1Label },
                        { val: t.stat2Value, lbl: t.stat2Label },
                        { val: t.stat3Value, lbl: t.stat3Label },
                        { val: t.stat4Value, lbl: t.stat4Label },
                    ].map((st, i) => (
                        <div key={i} style={{
                            backgroundColor: '#171f33',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>
                                {st.val}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#bbcabf' }}>
                                {st.lbl}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive Search Preview */}
            <section style={{
                backgroundColor: '#131b2e',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '80px 24px'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#10b981',
                            marginBottom: '12px'
                        }}>
                            {t.previewBadge}
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ffffff' }}>
                            {t.previewTitle}
                        </h2>
                        <p style={{ color: '#bbcabf', fontSize: '1rem', maxWidth: '700px', margin: '0 auto' }}>
                            {t.previewSubtitle}
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#0a111a',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            paddingBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                <span className="material-icons" style={{ fontSize: '16px', color: '#10b981' }}>sync</span>
                                finance.xardbaiz.im / vector-search-preview (200 OK)
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Qdrant Cosine Similarity</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: '#131b2e',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                            <span className="material-icons" style={{ color: '#10b981' }}>search</span>
                            <span style={{ color: '#ffffff', fontWeight: 500 }}>{t.previewSearchInput}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                            <div style={{
                                backgroundColor: '#171f33',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>YOU.US</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#34d399',
                                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                        padding: '2px 8px',
                                        borderRadius: '10px'
                                    }}>{t.previewMatch79}</span>
                                </div>
                                <div style={{ color: '#bbcabf', fontSize: '0.9rem', marginBottom: '12px' }}>Clear Secure Inc</div>
                                <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>{t.previewTargetUpside1}</div>
                            </div>

                            <div style={{
                                backgroundColor: '#171f33',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>ADBE.US</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#34d399',
                                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                        padding: '2px 8px',
                                        borderRadius: '10px'
                                    }}>{t.previewMatch79}</span>
                                </div>
                                <div style={{ color: '#bbcabf', fontSize: '0.9rem', marginBottom: '12px' }}>Adobe Systems Inc</div>
                                <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>{t.previewTargetUpside2}</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <a href="/ideas" style={{
                                color: '#10b981',
                                fontWeight: 600,
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                {t.previewCatalogBtn}
                                <span className="material-icons" style={{ fontSize: '18px' }}>arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pipeline Steps */}
            <section id="pipeline" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <div style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#10b981',
                        marginBottom: '12px'
                    }}>
                        {t.pipelineBadge}
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ffffff' }}>
                        {t.pipelineTitle}
                    </h2>
                    <p style={{ color: '#bbcabf', fontSize: '1rem', maxWidth: '750px', margin: '0 auto' }}>
                        {t.pipelineSubtitle}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px'
                }}>
                    {[
                        { icon: 'cloud_download', step: '01', title: t.step1Title, sub: t.step1Sub, desc: t.step1Desc, tag: t.step1Tag },
                        { icon: 'psychology', step: '02', title: t.step2Title, sub: t.step2Sub, desc: t.step2Desc, tag: t.step2Tag },
                        { icon: 'sell', step: '03', title: t.step3Title, sub: t.step3Sub, desc: t.step3Desc, tag: t.step3Tag },
                        { icon: 'hub', step: '04', title: t.step4Title, sub: t.step4Sub, desc: t.step4Desc, tag: t.step4Tag }
                    ].map((step, idx) => (
                        <div key={idx} style={{
                            backgroundColor: '#171f33',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '28px',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span className="material-icons" style={{ fontSize: '32px', color: '#10b981' }}>{step.icon}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Step {step.step}</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', margin: '0 0 4px 0' }}>{step.title}</h3>
                            <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 500, marginBottom: '16px' }}>{step.sub}</div>
                            <p style={{ fontSize: '0.9rem', color: '#bbcabf', lineHeight: 1.5, margin: '0 0 20px 0' }}>{step.desc}</p>
                            <span style={{
                                fontSize: '0.75rem',
                                color: '#95d3ba',
                                backgroundColor: '#0b513d',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontWeight: 600
                            }}>
                                {step.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* About & Transparency */}
            <section id="about" style={{
                backgroundColor: '#131b2e',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '80px 24px'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#10b981',
                            marginBottom: '12px'
                        }}>
                            {t.aboutBadge}
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ffffff' }}>
                            {t.aboutTitle}
                        </h2>
                        <p style={{ color: '#bbcabf', fontSize: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                            {t.aboutSubtitle}
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        marginBottom: '48px'
                    }}>
                        <div style={{ backgroundColor: '#171f33', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>
                                <span className="material-icons">verified_user</span>
                                {t.aboutFeat1Title}
                            </div>
                            <div style={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat1Desc}</div>
                        </div>
                        <div style={{ backgroundColor: '#171f33', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffb95f', fontWeight: 600, marginBottom: '8px' }}>
                                <span className="material-icons">dataset</span>
                                {t.aboutFeat2Title}
                            </div>
                            <div style={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat2Desc}</div>
                        </div>
                        <div style={{ backgroundColor: '#171f33', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>
                                <span className="material-icons">manage_search</span>
                                {t.aboutFeat3Title}
                            </div>
                            <div style={{ color: '#bbcabf', fontSize: '0.9rem' }}>{t.aboutFeat3Desc}</div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '16px' }}>{t.techStackTitle}</div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Node.js', 'Preact', 'Material UI', 'Qdrant', 'OpenAI', 'Supabase'].map((st, i) => (
                                <span key={i} style={{
                                    backgroundColor: '#0a111a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#ffffff',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500
                                }}>
                                    {st}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0' }}>
                    {t.ctaSectionTitle}
                </h2>
                <p style={{ color: '#bbcabf', fontSize: '1.1rem', marginBottom: '32px' }}>
                    {t.ctaSectionSub}
                </p>
                <a href="/ideas" style={{
                    backgroundColor: '#10b981',
                    color: '#05080e',
                    padding: '16px 36px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 28px rgba(16, 185, 129, 0.4)'
                }}>
                    {t.ctaExploreIdeas}
                    <span className="material-icons" style={{ fontSize: '22px' }}>trending_flat</span>
                </a>
            </section>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#060e20',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '60px 24px 32px 24px',
                color: '#bbcabf',
                fontSize: '0.875rem'
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '40px',
                    marginBottom: '48px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>
                            <span className="material-icons" style={{ color: '#10b981' }}>insights</span>
                            {t.brandName}
                        </div>
                        <p style={{ lineHeight: 1.6, margin: 0 }}>
                            {t.footerTagline}
                        </p>
                    </div>

                    <div>
                        <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>{t.footerNavTitle}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <a href="/" style={{ color: '#bbcabf', textDecoration: 'none' }}>{t.navHome}</a>
                            <a href="/ideas" style={{ color: '#bbcabf', textDecoration: 'none' }}>{t.navIdeas}</a>
                            <a href="#pipeline" style={{ color: '#bbcabf', textDecoration: 'none' }}>{t.navPipeline}</a>
                            <a href="#about" style={{ color: '#bbcabf', textDecoration: 'none' }}>{t.navAbout}</a>
                        </div>
                    </div>

                    <div>
                        <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>{t.footerGithubTitle}</div>
                        <p style={{ lineHeight: 1.6, margin: '0 0 12px 0' }}>
                            {t.footerGithubText}
                        </p>
                        <a href="https://github.com/xardbaiz/invest-idea-api" target="_blank" rel="noopener noreferrer" style={{
                            color: '#10b981',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span className="material-icons" style={{ fontSize: '18px' }}>terminal</span>
                            {t.githubRepo}
                        </a>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '24px',
                    fontSize: '0.8rem',
                    color: '#64748b'
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#ffb95f' }}>{t.disclaimerTitle}:</strong> {t.disclaimerText}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>{t.copyright}</div>
                        <div>{t.systemStatus}</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
