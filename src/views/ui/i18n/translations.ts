export type Language = 'en' | 'ru';

export const translations = {
    en: {
        // Common / Nav
        brandName: "AlphaPulse AI",
        navHome: "Home",
        navIdeas: "Ideas & Reviews",
        navPipeline: "AI Pipeline",
        navArchitecture: "Architecture",
        navAbout: "About",
        ctaExploreIdeas: "Explore Ideas",

        // Landing Hero
        heroBadge: "Smart Vector Analysis of Broker Analytics",
        heroTitle: "Search Investment Ideas from Broker Reports",
        heroSubtitle: "Automatically scanning broker recommendations, extracting key takeaways with language models, categorizing markets, and building vector semantic search to instantly locate top trading opportunities.",
        heroBtnSearch: "Go to Investment Ideas",
        heroBtnPipeline: "Explore Pipeline Architecture",
        heroStatus: "Fresh US & EU stock ideas available",

        // Landing Stats
        stat1Value: "12,400+",
        stat1Label: "Processed Reviews",
        stat2Value: "15+",
        stat2Label: "Brokers & Research Houses",
        stat3Value: "99.4%",
        stat3Label: "Summarization Accuracy",
        stat4Value: "< 150ms",
        stat4Label: "Vector Search Latency",

        // Landing Preview
        previewBadge: "Interactive Database Preview",
        previewTitle: "How Semantic Search Results Look",
        previewSubtitle: "Instant response: the neural network analyzes query intent, aligns analyst targets, and ranks results by relevance.",
        previewCatalogBtn: "Open Full Catalog",
        previewSampleLabel: "Sample Search Query: Qdrant Cosine Similarity",
        previewSearchInput: "Search 'Corporate AI Software Leaders'",
        previewMatch79: "79% Match",
        previewTargetUpside1: "$60.00 +57.5% Target Price",
        previewTargetUpside2: "$280.00 +12.5% Target Price",

        // Landing Pipeline
        pipelineBadge: "End-to-End Pipeline",
        pipelineTitle: "How Our AI Pipeline Works",
        pipelineSubtitle: "From raw broker data to multidimensional vector space: automated transformation of financial analytics across 4 engineering stages.",
        step1Title: "API Ingestion",
        step1Sub: "Raw Broker Data Harvesting",
        step1Desc: "Automated parsing and collection of daily morning notes and quarterly reports, target prices, and forecasts from leading broker APIs. HTML cleaning, date and ticker normalization.",
        step1Tag: "100% Automated",
        step2Title: "AI Summarizer",
        step2Sub: "Key Insights Summarization",
        step2Desc: "Large language models condense multi-page analytical notes into core bullet points (growth drivers, risks, target price).",
        step2Tag: "10x Context Compression",
        step3Title: "Smart Tagger",
        step3Sub: "Smart Categorization & Tagging",
        step3Desc: "Neural network classifies each idea across economic sectors (AI, Tech, Semiconductors, Biotech, Commodities).",
        step3Tag: "99.4% F1-score",
        step4Title: "Vector DB Engine",
        step4Sub: "Vector Embedding Indexing",
        step4Desc: "Converting analytical context into multidimensional vectors. Storing in Qdrant vector database for semantic search by meaning rather than keywords.",
        step4Tag: "Multidimensional Embedding",

        // Landing Pet Project / Transparency
        aboutBadge: "Open Analytics Pet-Project",
        aboutTitle: "Engineering Transparency Without Noise or Spam",
        aboutSubtitle: "Created by an engineer-investor to eliminate cognitive overload when reading hundreds of broker reports. Zero sponsored ads — strictly deterministic parsing algorithms, data normalization, and semantic clustering.",
        aboutFeat1Title: "No Noise or Spam",
        aboutFeat1Desc: "Filtering out filler text and promotional disclaimers.",
        aboutFeat2Title: "Facts & Numbers",
        aboutFeat2Desc: "Targets and upsides active now; P/E and multipliers in development (Coming Soon).",
        aboutFeat3Title: "Natural Language",
        aboutFeat3Desc: "Semantic vector search with Qdrant & OpenAI.",

        // Landing Tech Stack & Footer
        techStackTitle: "Technology Stack v2.4-production",
        githubRepo: "GitHub Repository (MIT License)",
        ctaSectionTitle: "Ready to find alpha in market analytics?",
        ctaSectionSub: "Explore live reviews from leading brokers, filtered by sector, date, and expected yield right now.",
        footerTagline: "Automated computational system generating investment ideas based on predictive analysis of market microstructures, consensus signals, and vector embeddings.",
        footerNavTitle: "Navigation",
        footerGithubTitle: "Repository & API",
        footerGithubText: "Open source inference core, endpoint documentation, and vectorization pipeline available on GitHub.",
        disclaimerTitle: "Disclaimer",
        disclaimerText: "This platform is an analytical software aggregator and does not provide individual investment recommendations. Forecasts are generated by algorithmic models based on vector analysis and LLM inference, do not guarantee yield, and do not constitute an offer to trade.",
        copyright: "© 2025 finance.xardbaiz.im. All rights reserved.",
        systemStatus: "System Status: Optimal (99.98% uptime)",

        // Ideas Search Page
        ideasPageTitle: "Search Investment Ideas",
        ideasPageSubtitle: "Smart vector search across analytics and recommendations",
        searchLabelQuery: "Search Query",
        searchPlaceholderQuery: "e.g., artificial intelligence, dividends or IT sector",
        searchLabelFrom: "Date From",
        searchLabelTo: "Date To",
        searchLabelLimit: "Limit",
        searchBtn: "Search",
        tablePromptInitial: "Enter a search query or set filter parameters to search for investment ideas.",
        tableNoResultsTitle: "No ideas found",
        tableNoResultsText: "Try changing your search query or expanding the time frame.",
        thTicker: "Ticker",
        thCompany: "Company",
        thSummary: "Summary",
        thCurrentPrice: "Current Price",
        thTargetPrice: "Target Price",
        thRelevance: "Relevance",
        thPublishDate: "Publish Date",
        btnExpand: "Expand",
        btnCollapse: "Collapse"
    },
    ru: {
        // Common / Nav
        brandName: "AlphaPulse AI",
        navHome: "Главная",
        navIdeas: "Идеи и обзоры",
        navPipeline: "AI Пайплайн",
        navArchitecture: "Архитектура",
        navAbout: "О проекте",
        ctaExploreIdeas: "Смотреть идеи",

        // Landing Hero
        heroBadge: "Умный векторный анализ аналитики брокеров",
        heroTitle: "Поиск инвестиционных идей из отчетов и обзоров",
        heroSubtitle: "Автоматически сканируем брокерские рекомендации, извлекаем суть с помощью языковых моделей, категоризируем рынки и строим векторный семантический поиск для моментального нахождения лучших торговых возможностей.",
        heroBtnSearch: "Перейти к поиску инвестиционных идей",
        heroBtnPipeline: "Изучить архитектуру пайплайна",
        heroStatus: "Доступны свежие идеи по акциям US & EU рынков",

        // Landing Stats
        stat1Value: "12,400+",
        stat1Label: "обработанных обзоров",
        stat2Value: "15+",
        stat2Label: "брокеров и инвестдомов",
        stat3Value: "99.4%",
        stat3Label: "точность суммаризации",
        stat4Value: "< 150мс",
        stat4Label: "векторный поиск",

        // Landing Preview
        previewBadge: "Интерактивная демонстрация базы данных",
        previewTitle: "Как выглядит выдача семантического поиска",
        previewSubtitle: "Мгновенный отклик: нейросеть анализирует смысл запроса, сопоставляет таргеты аналитиков и ранжирует результаты по релевантности.",
        previewCatalogBtn: "Открыть полный каталог",
        previewSampleLabel: "Пример поискового запроса: Qdrant Cosine Similarity",
        previewSearchInput: "Лидеры корпоративного AI ПО",
        previewMatch79: "Сходство: 79%",
        previewTargetUpside1: "$60.00 +57.5% целевая цена",
        previewTargetUpside2: "$280.00 +12.5% целевая цена",

        // Landing Pipeline
        pipelineBadge: "End-to-End Pipeline",
        pipelineTitle: "Как работает наш AI-пайплайн",
        pipelineSubtitle: "От сырых брокерских данных до многомерного векторного пространства: автоматическая трансформация финансовой аналитики за 4 инженерных этапа.",
        step1Title: "API Ingestion",
        step1Sub: "Сбор сырых данных из API брокеров",
        step1Desc: "Автоматический парсинг и сбор ежедневных утренних и квартальных обзоров, таргетов и прогнозов от ведущих брокерских API. Очистка HTML, нормализация дат и тикеров.",
        step1Tag: "100% авто",
        step2Title: "AI Summarizer",
        step2Sub: "Суммаризация ключевых выводов",
        step2Desc: "Большие языковые модели сжимают многостраничные аналитические записки до ключевых тезисов (драйверы роста, риски, целевая цена).",
        step2Tag: "10x сжатие",
        step3Title: "Smart Tagger",
        step3Sub: "Умная категоризация и разметка",
        step3Desc: "Нейросеть классифицирует каждую идею по секторам экономики (AI, Tech, Semiconductors, Biotech, Commodities).",
        step3Tag: "99.4% F1-score",
        step4Title: "Vector DB Engine",
        step4Sub: "Векторное эмбеддинг-индексирование",
        step4Desc: "Превращение аналитического контекста в многомерные векторы. Сохранение в векторную базу данных (Qdrant) для поиска по смыслу («компании для бума AI»), а не ключевым словам.",
        step4Tag: "Векторные измерения",

        // Landing Pet Project / Transparency
        aboutBadge: "Open Analytics Pet-Project",
        aboutTitle: "Инженерная прозрачность без шума и спама",
        aboutSubtitle: "Проект создан как пет-проект инженером-инвестором для устранения когнитивной перегрузки при чтении сотен брокерских отчетов. Никакой субъективной рекламы — только строгие алгоритмы парсинга, нормализации данных и семантической кластеризации.",
        aboutFeat1Title: "Без шума и спама",
        aboutFeat1Desc: "Отсекаем воду и рекламные дисклеймеры.",
        aboutFeat2Title: "Факты и цифры",
        aboutFeat2Desc: "Таргеты и апсайды сейчас; P/E и мультипликаторы — в разработке (Coming Soon).",
        aboutFeat3Title: "Естественный язык",
        aboutFeat3Desc: "Семантический векторный поиск по смыслу.",

        // Landing Tech Stack & Footer
        techStackTitle: "Стек технологий v2.4-production",
        githubRepo: "Исходный код на GitHub (MIT License)",
        ctaSectionTitle: "Готовы найти альфу в океане рыночной аналитики?",
        ctaSectionSub: "Исследуйте актуальные обзоры от ведущих брокеров, отфильтрованные по отраслям, датам и ожидаемой доходности прямо сейчас.",
        footerTagline: "Автоматизированный вычислительный комплекс генерации инвест-идей на основе предиктивного анализа рыночных микроструктур, консенсус-сигналов и векторных эмбеддингов.",
        footerNavTitle: "Навигация",
        footerGithubTitle: "Репозиторий и API",
        footerGithubText: "Открытый исходный код инференс-ядра, документация эндпоинтов и пайплайн векторизации финансовых метрик доступны в GitHub.",
        disclaimerTitle: "Отказ от ответственности (Дисклеймер)",
        disclaimerText: "Платформа является аналитическим программным агрегатором и не предоставляет индивидуальных инвестиционных рекомендаций. Представленные прогнозы сформированы алгоритмическими моделями на базе векторного анализа и LLM-инференса, не гарантируют доходность и не являются офертой на проведение операций с финансовыми инструментами.",
        copyright: "© 2025 finance.xardbaiz.im. Все права защищены.",
        systemStatus: "System Status: Optimal (99.98% uptime)",

        // Ideas Search Page
        ideasPageTitle: "Поиск инвестиционных идей",
        ideasPageSubtitle: "Умный векторный поиск по аналитике и рекомендациям",
        searchLabelQuery: "Поисковый запрос",
        searchPlaceholderQuery: "например, искусственный интеллект, дивиденды или IT сектор",
        searchLabelFrom: "Дата с",
        searchLabelTo: "Дата по",
        searchLabelLimit: "Лимит",
        searchBtn: "Искать",
        tablePromptInitial: "Введите поисковый запрос или задайте параметры фильтрации для поиска инвестиционных идей.",
        tableNoResultsTitle: "Идеи не найдены",
        tableNoResultsText: "Попробуйте изменить поисковый запрос или расширить временной интервал.",
        thTicker: "Тикер",
        thCompany: "Компания",
        thSummary: "Сводка",
        thCurrentPrice: "Текущая цена",
        thTargetPrice: "Целевая цена",
        thRelevance: "Релевантность",
        thPublishDate: "Дата публикации",
        btnExpand: "Развернуть",
        btnCollapse: "Свернуть"
    }
};

export function getLanguageFromHeader(acceptLanguage?: string): Language {
    if (!acceptLanguage) return 'en';
    const primary = acceptLanguage.toLowerCase();
    if (primary.includes('ru')) return 'ru';
    return 'en';
}

export function getTranslations(lang: Language = 'en') {
    return translations[lang] || translations.en;
}
