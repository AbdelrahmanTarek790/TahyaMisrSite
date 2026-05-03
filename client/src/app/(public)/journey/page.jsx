import React from "react";
import Icon from "@/components/AppIcon";
import { timelineAPI } from "@/app/api/api";
import TimelineClient from "./TimelineClient";

// Server-side data fetching
async function getTimeline() {
    try {
        const response = await fetch(
            'https://tmbackend.tahyamisryu.com/api/v1/timeline',
            {
                next: { revalidate: 300 } // Revalidate every 5 minutes
            }
        );
        
        if (!response.ok) {
            return fallbackTimelineEvents;
        }
        
        const data = await response.json();
        return data.data?.timeline || data.timeline || fallbackTimelineEvents;
    } catch (error) {
        console.error('Failed to fetch timeline:', error);
        return fallbackTimelineEvents;
    }
}

// Fallback timeline events
const fallbackTimelineEvents = [
    {
        year: "2018",
        title: "إعادة الهيكلة وتعديل اللائحة الداخلية",
        description: "بداية مرحلة جديدة من التطوير والتحديث",
        achievement: "تحديث شامل للهيكل التنظيمي",
    },
    {
        year: "2019",
        title: "الشراكات الاستراتيجية",
        description: "مبادرات بالتعاون مع الهيئة العامة للاستعلامات ومؤسسة القادة",
        achievement: "تعزيز الشراكات الحكومية والمؤسسية",
    },
    {
        year: "2020",
        title: "جائزة أفضل كيان شبابي للتميز",
        description: "برعاية الدكتور أشرف صبحي وزير الشباب والرياضة",
        achievement: "الحصول على أعلى جائزة للتميز الشبابي",
    },
    {
        year: "2021",
        title: "رعاية دولة رئيس مجلس الوزراء",
        description: "الحصول على الرعاية الرسمية من أعلى المستويات",
        achievement: "اعتراف حكومي رسمي بالدور المؤثر",
    },
    {
        year: "2022",
        title: "التوسع والإنجازات",
        description: "تنفيذ أكبر عدد من المبادرات والشراكات",
        achievement: "تسجيل أكبر منصة حوارية للشباب",
    },
    {
        year: "2023",
        title: "المشاركة في الحملة الرئاسية",
        description: "لجنة المتطوعين والكيانات الشبابية بالحملة الرسمية للرئيس عبد الفتاح السيسي",
        achievement: "دور محوري في الحملة الرئاسية",
    },
    {
        year: "2024",
        title: "القمة الشبابية العربية",
        description: "تنفيذ القمة الشبابية العربية بالتعاون مع جامعة الدول العربية",
        achievement: "استضافة أكبر تجمع شبابي عربي",
    },
    {
        year: "2025",
        title: "الاتحاد المستقل",
        description: "اشهار اتحاد شباب تحيا مصر هيئة شبابية مستقلة تابعة لوزارة الشباب والرياضة",
        achievement: "تحويل إلى هيئة شبابية مستقلة رسمية",
    },
];

// Generate metadata for SEO
export const metadata = {
    title: "رحلتنا - اتحاد شباب تحيا مصر | تاريخ من الإنجازات",
    description: "تعرف على رحلة اتحاد شباب تحيا مصر منذ 2018، إنجازاتنا، مبادراتنا، وميادين عملنا في خدمة الشباب المصري والوطن",
    keywords: "رحلة الاتحاد, تاريخ اتحاد شباب تحيا مصر, إنجازات الاتحاد, مبادرات شبابية, جوائز, شراكات, تطوير الشباب",
    openGraph: {
        title: "رحلتنا - اتحاد شباب تحيا مصر",
        description: "رحلة من الإنجازات والتطوير منذ 2018 حتى اليوم",
        url: "https://tahyamisryu.com/journey",
        siteName: "اتحاد شباب تحيا مصر",
        images: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "رحلة اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "رحلتنا - اتحاد شباب تحيا مصر",
        description: "تاريخ من الإنجازات في خدمة الشباب المصري",
        images: ["https://tahyamisryu.com/Logo.webp"],
    },
    alternates: {
        canonical: "https://tahyamisryu.com/journey",
    },
};

export default async function JourneyPage() {
    const timelineEvents = await getTimeline();
        

    const pillars = [
        {
            icon: "Award",
            title: "أولويات الشباب في مصر",
            description: "نركز على القضايا الأساسية التي تهم الشباب المصري وتؤثر على مستقبلهم وحياتهم اليومية.",
            features: [
                "التعليم والتطوير الشخصي",
                "الرعاية الصحية",
                "الأمن والاستقرار والسلامة",
                "الدخل وفرص العمل",
                "التطوير الشخصي وبناء الذات",
                "البيئة",
                "البنية التحتية والمرافق",
                "المشاركة المجتمعية",
                "الترفيه والهوايات",
                "التطوير التكنولوجي والذكاء الاصطناعي",
            ],
        },
        {
            icon: "Network",
            title: "ميادين العمل لاتحاد شباب تحيا مصر",
            description: "نعمل في مجالات متنوعة لخدمة الشباب والمجتمع المصري في جميع القطاعات الحيوية.",
            features: [
                "المجال المجتمعي والتطوعي",
                "المجال السياسي والوطني",
                "المجال التنموي والاقتصادي",
                "المجال الثقافي والفني",
                "المجال التعليمي وبناء القدرات",
                "المجال الرياضي والصحي",
                "المجال البيئي والاستدامة",
            ],
        },
        {
            icon: "Target",
            title: "رؤيتنا المستقبلية",
            description: "نسعى لبناء جيل من الشباب القادر على قيادة مصر نحو مستقبل أفضل من خلال العمل المنظم والهادف.",
            features: [
                "تمكين الشباب من المشاركة الفعالة",
                "بناء القدرات والمهارات القيادية",
                "تعزيز الوعي المجتمعي والوطني",
                "دعم المبادرات الشبابية المبتكرة",
                "تحقيق التواصل مع صناع القرار",
                "المساهمة في التنمية المستدامة",
            ],
        },
    ];

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        name: "رحلة اتحاد شباب تحيا مصر",
                        description: "رحلة من الإنجازات والتطوير منذ 2018",
                        url: "https://tahyamisryu.com/journey",
                        mainEntity: {
                            "@type": "Organization",
                            name: "اتحاد شباب تحيا مصر",
                            foundingDate: "2018",
                        },
                    }),
                }}
            />

            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        {/* <div className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mb-4">
                        
                    </div> */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-arabic">رحلة الاتحاد</h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto">نحن نؤمن بقوة الشباب في تشكيل مستقبل مصر.</p>
                    </div>

                    {/* Three Pillars */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        {pillars?.map((pillar, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevation transition-smooth border border-border"
                            >
                                <div className=" bg-success/10 rounded-2xl flex items-center justify-end mb-6">
                                    <Icon name={pillar?.icon} size={32} className="text-green-500 " />
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-4">{pillar?.title}</h3>
                                <p className="text-text-secondary mb-6 leading-relaxed">{pillar?.description}</p>

                                <ul className="space-y-3">
                                    {pillar?.features?.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex  gap-3">
                                            <Icon name="Check" size={16} className="text-green-500" />
                                            <span className="text-sm text-text-secondary">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Interactive Timeline */}
                    <div className="bg-muted rounded-3xl p-8 lg:p-12">
                        <h3 className="text-3xl font-bold text-foreground mb-12 text-center">محطات بارزة في مسيرة الاتحاد</h3>
                        <TimelineClient timelineEvents={timelineEvents} />
                    </div>
                </div>
            </section>
        </>
    );
}
