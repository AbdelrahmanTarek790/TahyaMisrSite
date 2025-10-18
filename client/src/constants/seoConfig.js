/**
 * SEO Configuration for all public pages
 * Contains metadata for both Arabic and English versions
 */

export const seoConfig = {
    // Default site-wide settings
    site: {
        name: {
            ar: "اتحاد شباب تحيا مصر",
            en: "Tahya Misr Youth Union",
        },
        description: {
            ar: "اتحاد شباب تحيا مصر - منصة تجمع الشباب المصري لبناء مستقبل أفضل من خلال الوحدة والقيادة والتغيير الإيجابي",
            en: "Tahya Misr Youth Union - A platform uniting Egyptian youth to build a better future through unity, leadership, and positive change",
        },
        url: "https://tahyamisryu.com",
        logo: "/Logo.webp",
        author: "اتحاد شباب تحيا مصر",
        keywords: {
            ar: "اتحاد شباب، تحيا مصر، الشباب المصري، القيادة، التطوع، الأنشطة الطلابية، مصر، التنمية المجتمعية",
            en: "youth union, tahya misr, egyptian youth, leadership, volunteering, student activities, egypt, community development",
        },
    },

    // Page-specific configurations
    pages: {
        home: {
            title: {
                ar: "اتحاد شباب تحيا مصر - الصفحة الرئيسية",
                en: "Tahya Misr Youth Union - Home",
            },
            description: {
                ar: "انضم إلى اتحاد شباب تحيا مصر واكتشف الفرص والأنشطة المتاحة للشباب المصري. معاً نبني مستقبل أفضل لمصر",
                en: "Join Tahya Misr Youth Union and discover opportunities and activities for Egyptian youth. Together we build a better future for Egypt",
            },
            keywords: {
                ar: "اتحاد شباب تحيا مصر، الصفحة الرئيسية، الشباب المصري، الأنشطة، الفعاليات، الأخبار",
                en: "tahya misr youth union, homepage, egyptian youth, activities, events, news",
            },
            url: "/",
            type: "website",
        },

        about: {
            title: {
                ar: "من نحن - اتحاد شباب تحيا مصر",
                en: "About Us - Tahya Misr Youth Union",
            },
            description: {
                ar: "تعرف على رسالة ورؤية اتحاد شباب تحيا مصر وكيف نعمل على تمكين الشباب المصري وتنمية قدراتهم القيادية",
                en: "Learn about Tahya Misr Youth Union's mission and vision, and how we empower Egyptian youth and develop their leadership skills",
            },
            keywords: {
                ar: "من نحن، رسالة، رؤية، أهداف، اتحاد شباب تحيا مصر، تاريخ المؤسسة",
                en: "about us, mission, vision, goals, tahya misr youth union, organization history",
            },
            url: "/about",
            type: "website",
        },

        contact: {
            title: {
                ar: "تواصل معنا - اتحاد شباب تحيا مصر",
                en: "Contact Us - Tahya Misr Youth Union",
            },
            description: {
                ar: "تواصل مع فريق اتحاد شباب تحيا مصر. نحن هنا للإجابة على استفساراتك ومساعدتك في الانضمام إلى مجتمعنا",
                en: "Get in touch with Tahya Misr Youth Union team. We are here to answer your questions and help you join our community",
            },
            keywords: {
                ar: "تواصل، اتصال، عنوان، هاتف، بريد إلكتروني، خدمة العملاء",
                en: "contact, communication, address, phone, email, customer service",
            },
            url: "/contact",
            type: "website",
        },

        team: {
            title: {
                ar: "فريق العمل - اتحاد شباب تحيا مصر",
                en: "Our Team - Tahya Misr Youth Union",
            },
            description: {
                ar: "تعرف على فريق العمل المتميز في اتحاد شباب تحيا مصر. قادة وخبراء يعملون على تمكين الشباب المصري",
                en: "Meet the outstanding team of Tahya Misr Youth Union. Leaders and experts working to empower Egyptian youth",
            },
            keywords: {
                ar: "فريق العمل، قادة، خبراء، إدارة، أعضاء الفريق، قيادات شبابية",
                en: "team, leaders, experts, management, team members, youth leadership",
            },
            url: "/team",
            type: "website",
        },

        news: {
            title: {
                ar: "الأخبار - اتحاد شباب تحيا مصر",
                en: "News - Tahya Misr Youth Union",
            },
            description: {
                ar: "تابع آخر أخبار وأنشطة اتحاد شباب تحيا مصر. اطلع على أحدث المستجدات والإنجازات والمبادرات",
                en: "Follow the latest news and activities of Tahya Misr Youth Union. Stay updated with recent developments, achievements, and initiatives",
            },
            keywords: {
                ar: "أخبار، مستجدات، أنشطة، إنجازات، مبادرات، فعاليات حديثة",
                en: "news, updates, activities, achievements, initiatives, recent events",
            },
            url: "/news",
            type: "website",
        },

        events: {
            title: {
                ar: "الفعاليات - اتحاد شباب تحيا مصر",
                en: "Events - Tahya Misr Youth Union",
            },
            description: {
                ar: "اكتشف الفعاليات والأنشطة القادمة لاتحاد شباب تحيا مصر. انضم إلى فعالياتنا وكن جزءاً من التغيير",
                en: "Discover upcoming events and activities of Tahya Misr Youth Union. Join our events and be part of the change",
            },
            keywords: {
                ar: "فعاليات، أنشطة، مؤتمرات، ورش عمل، دورات تدريبية، مناسبات",
                en: "events, activities, conferences, workshops, training courses, occasions",
            },
            url: "/events",
            type: "website",
        },

        journey: {
            title: {
                ar: "رحلتنا - اتحاد شباب تحيا مصر",
                en: "Our Journey - Tahya Misr Youth Union",
            },
            description: {
                ar: "تعرف على تاريخ ومراحل تطور اتحاد شباب تحيا مصر منذ التأسيس وحتى اليوم",
                en: "Learn about the history and development stages of Tahya Misr Youth Union from establishment to today",
            },
            keywords: {
                ar: "رحلة، تاريخ، تطور، مراحل، نمو، إنجازات تاريخية",
                en: "journey, history, development, stages, growth, historical achievements",
            },
            url: "/journey",
            type: "website",
        },

        help: {
            title: {
                ar: "المساعدة - اتحاد شباب تحيا مصر",
                en: "Help - Tahya Misr Youth Union",
            },
            description: {
                ar: "احصل على المساعدة والدعم من فريق اتحاد شباب تحيا مصر. إرشادات وحلول لجميع استفساراتك",
                en: "Get help and support from Tahya Misr Youth Union team. Guidelines and solutions for all your inquiries",
            },
            keywords: {
                ar: "مساعدة، دعم، إرشادات، حلول، استفسارات، خدمة العملاء",
                en: "help, support, guidelines, solutions, inquiries, customer service",
            },
            url: "/help",
            type: "website",
        },

        terms: {
            title: {
                ar: "شروط الاستخدام - اتحاد شباب تحيا مصر",
                en: "Terms of Service - Tahya Misr Youth Union",
            },
            description: {
                ar: "اقرأ شروط وأحكام استخدام منصة اتحاد شباب تحيا مصر وخدماتها المختلفة",
                en: "Read the terms and conditions for using Tahya Misr Youth Union platform and its various services",
            },
            keywords: {
                ar: "شروط الاستخدام، أحكام، قوانين، سياسات، استخدام المنصة",
                en: "terms of service, conditions, rules, policies, platform usage",
            },
            url: "/terms",
            type: "website",
        },

        privacy: {
            title: {
                ar: "سياسة الخصوصية - اتحاد شباب تحيا مصر",
                en: "Privacy Policy - Tahya Misr Youth Union",
            },
            description: {
                ar: "تعرف على سياسة الخصوصية وحماية البيانات في منصة اتحاد شباب تحيا مصر",
                en: "Learn about privacy policy and data protection in Tahya Misr Youth Union platform",
            },
            keywords: {
                ar: "سياسة الخصوصية، حماية البيانات، أمان المعلومات، خصوصية المستخدم",
                en: "privacy policy, data protection, information security, user privacy",
            },
            url: "/privacy",
            type: "website",
        },

        faq: {
            title: {
                ar: "الأسئلة الشائعة - اتحاد شباب تحيا مصر",
                en: "FAQ - Tahya Misr Youth Union",
            },
            description: {
                ar: "إجابات على الأسئلة الأكثر شيوعاً حول اتحاد شباب تحيا مصر وخدماته",
                en: "Answers to the most frequently asked questions about Tahya Misr Youth Union and its services",
            },
            keywords: {
                ar: "أسئلة شائعة، إجابات، استفسارات، مساعدة، معلومات عامة",
                en: "FAQ, frequently asked questions, answers, inquiries, help, general information",
            },
            url: "/faq",
            type: "website",
        },

        join: {
            title: {
                ar: "انضم إلينا - اتحاد شباب تحيا مصر",
                en: "Join Us - Tahya Misr Youth Union",
            },
            description: {
                ar: "سجل طلب انضمام إلى اتحاد شباب تحيا مصر وكن جزءاً من مجتمع الشباب المصري الطموح",
                en: "Submit a join request to Tahya Misr Youth Union and be part of the ambitious Egyptian youth community",
            },
            keywords: {
                ar: "انضمام، تسجيل، عضوية، طلب انضمام، مجتمع الشباب",
                en: "join, registration, membership, join request, youth community",
            },
            url: "/join",
            type: "website",
        },
    },

    // Structured data schemas
    structuredData: {
        organization: {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "اتحاد شباب تحيا مصر",
            alternateName: "Tahya Misr Youth Union",
            url: "https://tahyamisryu.com",
            logo: "https://tahyamisryu.com/Logo.webp",
            description: "اتحاد شباب تحيا مصر - منصة تجمع الشباب المصري لبناء مستقبل أفضل من خلال الوحدة والقيادة والتغيير الإيجابي",
            foundingDate: "2020",
            sameAs: ["https://facebook.com/tahyamisr", "https://twitter.com/tahyamisr", "https://instagram.com/tahyamisr"],
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["Arabic", "English"],
            },
        },

        website: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "اتحاد شباب تحيا مصر",
            url: "https://tahyamisryu.com",
            description: "اتحاد شباب تحيا مصر - منصة تجمع الشباب المصري لبناء مستقبل أفضل",
            inLanguage: ["ar", "en"],
            potentialAction: {
                "@type": "SearchAction",
                target: "https://tahyamisryu.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
            },
        },
    },
}

/**
 * Get SEO configuration for a specific page
 * @param {string} pageKey - The page key from seoConfig.pages
 * @param {string} locale - The locale (ar or en)
 * @param {Object} dynamicData - Dynamic data for the page (title, description, etc.)
 * @returns {Object} SEO configuration object
 */
export const getPageSEO = (pageKey, locale = "ar", dynamicData = {}) => {
    const site = seoConfig.site
    const page = seoConfig.pages[pageKey] || seoConfig.pages.home

    return {
        title: dynamicData.title || page.title[locale] || page.title.ar,
        description: dynamicData.description || page.description[locale] || page.description.ar,
        keywords: dynamicData.keywords || page.keywords[locale] || page.keywords.ar,
        author: site.author,
        image: dynamicData.image || site.logo,
        url: dynamicData.url || page.url,
        type: page.type || "website",
        locale: locale,
        alternateLanguages: [
            { locale: "ar", url: page.url },
            { locale: "en", url: page.url },
        ],
        structuredData: dynamicData.structuredData || (pageKey === "home" ? seoConfig.structuredData.organization : null),
    }
}
