// Server-side meta generation using SEO configuration
import fetch from "node-fetch"

// Import your SEO configuration (we'll need to adjust the import path for server-side use)
const seoConfig = {
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
        logo: "/Logo.png",
        author: "اتحاد شباب تحيا مصر",
        keywords: {
            ar: "اتحاد شباب، تحيا مصر، الشباب المصري، القيادة، التطوع، الأنشطة الطلابية، مصر، التنمية المجتمعية",
            en: "youth union, tahya misr, egyptian youth, leadership, volunteering, student activities, egypt, community development",
        },
    },
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
        join: {
            title: {
                ar: "انضم إلينا - اتحاد شباب تحيا مصر",
                en: "Join Us - Tahya Misr Youth Union",
            },
            description: {
                ar: "انضم إلى اتحاد شباب تحيا مصر وكن جزءاً من التغيير. سجل الآن وابدأ رحلتك مع مجتمع الشباب المصري",
                en: "Join Tahya Misr Youth Union and be part of the change. Register now and start your journey with the Egyptian youth community",
            },
            keywords: {
                ar: "انضم، تسجيل، عضوية، مشاركة، التحاق، مجتمع الشباب",
                en: "join, register, membership, participation, enrollment, youth community",
            },
            url: "/join",
            type: "website",
        },
        help: {
            title: {
                ar: "المساعدة - اتحاد شباب تحيا مصر",
                en: "Help - Tahya Misr Youth Union",
            },
            description: {
                ar: "احصل على المساعدة والدعم الذي تحتاجه. دليل شامل للأسئلة الشائعة والمساعدة التقنية",
                en: "Get the help and support you need. Comprehensive guide for frequently asked questions and technical assistance",
            },
            keywords: {
                ar: "مساعدة، دعم، إرشادات، حلول، خدمة العملاء، الأسئلة الشائعة",
                en: "help, support, guidance, solutions, customer service, frequently asked questions",
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
                ar: "اطلع على شروط وأحكام استخدام منصة اتحاد شباب تحيا مصر والقواعد المتعلقة بالعضوية والمشاركة",
                en: "Review the terms and conditions for using Tahya Misr Youth Union platform and rules regarding membership and participation",
            },
            keywords: {
                ar: "شروط الاستخدام، أحكام، قواعد، قوانين، سياسات، التزامات",
                en: "terms of service, conditions, rules, policies, regulations, obligations",
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
                ar: "تعرف على كيفية حمايتنا لخصوصيتك وبياناتك الشخصية في منصة اتحاد شباب تحيا مصر",
                en: "Learn how we protect your privacy and personal data on Tahya Misr Youth Union platform",
            },
            keywords: {
                ar: "سياسة الخصوصية، حماية البيانات، الأمان، المعلومات الشخصية، الحقوق",
                en: "privacy policy, data protection, security, personal information, rights",
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
                ar: "إجابات على الأسئلة الأكثر شيوعاً حول اتحاد شباب تحيا مصر وخدماتنا وكيفية المشاركة",
                en: "Answers to the most frequently asked questions about Tahya Misr Youth Union and our services and how to participate",
            },
            keywords: {
                ar: "أسئلة شائعة، إجابات، استفسارات، معلومات، شرح، توضيحات",
                en: "frequently asked questions, answers, inquiries, information, explanations, clarifications",
            },
            url: "/faq",
            type: "website",
        },
    },
}

/**
 * Get SEO configuration for a specific page (server-side version)
 */
function getPageSEO(pageKey, locale = "ar", dynamicData = {}) {
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
    }
}

/**
 * Generate structured data (JSON-LD) for different page types
 */
function generateStructuredData(pageType, meta, url) {
    const baseUrl = seoConfig.site.url

    switch (pageType) {
        case "home":
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: seoConfig.site.name.ar,
                url: baseUrl,
                logo: `${baseUrl}${seoConfig.site.logo}`,
                description: seoConfig.site.description.ar,
                sameAs: [
                    // Add your social media URLs here
                ],
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    availableLanguage: ["Arabic", "English"],
                },
            }

        case "article":
            return {
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: meta.title,
                description: meta.description,
                image: meta.image,
                url: meta.url,
                datePublished: new Date().toISOString(),
                author: {
                    "@type": "Organization",
                    name: meta.author,
                },
                publisher: {
                    "@type": "Organization",
                    name: seoConfig.site.name.ar,
                    logo: {
                        "@type": "ImageObject",
                        url: `${baseUrl}${seoConfig.site.logo}`,
                    },
                },
            }

        case "website":
        default:
            return {
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: meta.title,
                description: meta.description,
                url: meta.url,
                isPartOf: {
                    "@type": "WebSite",
                    name: seoConfig.site.name.ar,
                    url: baseUrl,
                },
            }
    }
}

/**
 * Route-based meta generation for server-side rendering
 */
export async function getPageMeta(url, locale = "ar") {
    const baseUrl = seoConfig.site.url

    // Helper function to escape HTML for safety
    const escapeHtml = (str) => (str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "")

    try {
        // Handle dynamic news pages
        if (url.startsWith("/news/")) {
            const id = url.split("/news/")[1]
            if (id && id !== "" && id !== "undefined") {
                try {
                    const apiRes = await fetch(`https://form.codepeak.software/api/v1/news/${id}`)
                    if (apiRes.ok) {
                        const { data } = await apiRes.json()
                        if (data) {
                            const articleMeta = {
                                title: escapeHtml(data.title || "خبر - اتحاد شباب تحيا مصر"),
                                description: escapeHtml(
                                    (data.content && data.content.slice(0, 150).replace(/\r?\n|\r/g, " ") + "...") ||
                                        "تابع آخر أخبار وأنشطة اتحاد شباب تحيا مصر"
                                ),
                                keywords: escapeHtml("أخبار، اتحاد شباب تحيا مصر، " + (data.title || "")),
                                image: data.image ? `https://form.codepeak.software/uploads/${data.image}` : `${baseUrl}/Logo.webp`,
                                url: `${baseUrl}${url}`,
                                type: "article",
                                author: escapeHtml(data.author?.name || "اتحاد شباب تحيا مصر"),
                                locale: locale,
                            }

                            return {
                                ...articleMeta,
                                structuredData: generateStructuredData("article", articleMeta, url),
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching news metadata:", err)
                }
            }
            // Fallback to news page meta
            const newsMeta = getPageSEO("news", locale)
            const newsPageMeta = {
                ...newsMeta,
                title: escapeHtml(newsMeta.title),
                description: escapeHtml(newsMeta.description),
                keywords: escapeHtml(newsMeta.keywords),
                image: `${baseUrl}${newsMeta.image}`,
                url: `${baseUrl}${newsMeta.url}`,
                author: escapeHtml(newsMeta.author),
            }

            return {
                ...newsPageMeta,
                structuredData: generateStructuredData("website", newsPageMeta, url),
            }
        }

        // Handle static pages based on URL patterns
        let pageKey = "home"

        if (url === "/" || url === "") {
            pageKey = "home"
        } else if (url.startsWith("/about")) {
            pageKey = "about"
        } else if (url.startsWith("/team")) {
            pageKey = "team"
        } else if (url.startsWith("/news")) {
            pageKey = "news"
        } else if (url.startsWith("/contact")) {
            pageKey = "contact"
        } else if (url.startsWith("/events")) {
            pageKey = "events"
        } else if (url.startsWith("/journey")) {
            pageKey = "journey"
        } else if (url.startsWith("/join")) {
            pageKey = "join"
        } else if (url.startsWith("/help")) {
            pageKey = "help"
        } else if (url.startsWith("/terms")) {
            pageKey = "terms"
        } else if (url.startsWith("/privacy")) {
            pageKey = "privacy"
        } else if (url.startsWith("/faq")) {
            pageKey = "faq"
        }

        const seoData = getPageSEO(pageKey, locale)
        const pageMeta = {
            title: escapeHtml(seoData.title),
            description: escapeHtml(seoData.description),
            keywords: escapeHtml(seoData.keywords),
            image: `${baseUrl}${seoData.image}`,
            url: `${baseUrl}${seoData.url}`,
            type: seoData.type,
            author: escapeHtml(seoData.author),
            locale: seoData.locale,
        }

        return {
            ...pageMeta,
            structuredData: generateStructuredData(pageKey === "home" ? "home" : "website", pageMeta, url),
        }
    } catch (error) {
        console.error("Error generating page metadata:", error)

        // Fallback to default site meta
        const defaultSeo = getPageSEO("home", locale)
        const defaultMeta = {
            title: escapeHtml(defaultSeo.title),
            description: escapeHtml(defaultSeo.description),
            keywords: escapeHtml(defaultSeo.keywords),
            image: `${baseUrl}${defaultSeo.image}`,
            url: `${baseUrl}/`,
            type: defaultSeo.type,
            author: escapeHtml(defaultSeo.author),
            locale: defaultSeo.locale,
        }

        return {
            ...defaultMeta,
            structuredData: generateStructuredData("home", defaultMeta, "/"),
        }
    }
}
