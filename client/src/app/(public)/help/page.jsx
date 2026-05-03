import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, HeadphonesIcon, Clock, MapPin } from "lucide-react"
import HelpClient from "./HelpClient"

// Generate metadata for SEO
export const metadata = {
    title: "مركز المساعدة - اتحاد شباب تحيا مصر | Help Center",
    description:
        "احصل على المساعدة والدعم من فريق اتحاد شباب تحيا مصر. إجابات على الأسئلة الشائعة، الدعم الهاتفي، البريد الإلكتروني، والدردشة المباشرة",
    keywords: "مساعدة, دعم, help, support, خدمة العملاء, تواصل, اتصال, دردشة مباشرة, اتحاد شباب تحيا مصر",
    openGraph: {
        title: "مركز المساعدة - اتحاد شباب تحيا مصر",
        description: "فريق الدعم جاهز لمساعدتك على مدار الساعة",
        url: "https://tahyamisryu.com/help",
        siteName: "اتحاد شباب تحيا مصر",
        images: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "مركز المساعدة - اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "مركز المساعدة - اتحاد شباب تحيا مصر",
        description: "نحن هنا لمساعدتك في أي وقت",
        images: ["https://tahyamisryu.com/Logo.webp"],
    },
    alternates: {
        canonical: "https://tahyamisryu.com/help",
    },
}

export default function HelpPage() {
    const faqItems = [
        {
            question: "كيف يمكنني الانضمام إلى اتحاد شباب تحيا مصر؟",
            answer: "يمكنك الانضمام من خلال ملء نموذج التسجيل المتاح على موقعنا الإلكتروني. ستحتاج إلى تقديم معلوماتك الشخصية والمؤهلات ومجالات الاهتمام. سيتم مراجعة طلبك والتواصل معك خلال 3-5 أيام عمل.",
        },
        {
            question: "ما هي شروط العضوية في الاتحاد؟",
            answer: "يجب أن تكون مصري الجنسية، تتراوح أعمارك بين 18-35 عامًا، ولديك الرغبة في المشاركة في الأنشطة التطوعية وخدمة المجتمع. كما نرحب بجميع المؤهلات والخلفيات التعليمية.",
        },
        {
            question: "ما هي الأنشطة التي يقدمها الاتحاد؟",
            answer: "نقدم مجموعة متنوعة من الأنشطة تشمل: ورش التدريب والتطوير، المشاريع المجتمعية، الفعاليات الثقافية والرياضية، برامج التوجيه والإرشاد، والمؤتمرات والندوات التخصصية.",
        },
        {
            question: "هل هناك رسوم للانضمام؟",
            answer: "لا، العضوية في اتحاد شباب تحيا مصر مجانية تمامًا. نحن منظمة غير ربحية تهدف إلى خدمة الشباب المصري دون أي رسوم أو اشتراكات.",
        },
        {
            question: "كيف يمكنني التطوع في المشاريع؟",
            answer: "يمكنك التطوع من خلال التسجيل في الأنشطة المختلفة المعلنة على موقعنا أو صفحاتنا على وسائل التواصل الاجتماعي. كما يمكنك التواصل مع الفريق المسؤول عن المتطوعين مباشرة.",
        },
        {
            question: "هل يمكنني اقتراح مشروع جديد؟",
            answer: "بالطبع! نرحب بجميع الأفكار والمبادرات الإبداعية من أعضائنا. يمكنك تقديم اقتراحك من خلال نموذج خاص متاح في قسم الأعضاء، وسيتم دراسته من قبل اللجنة المختصة.",
        },
    ]

    const supportOptions = [
        {
            icon: Phone,
            title: "الدعم الهاتفي",
            description: "تواصل معنا هاتفيًا للحصول على مساعدة فورية",
            contact: "+20 123 456 7890",
            availability: "الأحد - الخميس: 9 صباحًا - 6 مساءً",
        },
        {
            icon: Mail,
            title: "البريد الإلكتروني",
            description: "أرسل لنا رسالة وسنرد عليك خلال 24 ساعة",
            contact: "support@tahyamisryu.com",
            availability: "متاح 24/7",
        },
        {
            icon: MessageCircle,
            title: "الدردشة المباشرة",
            description: "تحدث مع فريق الدعم مباشرة عبر الموقع",
            contact: "ابدأ المحادثة",
            availability: "الأحد - الخميس: 9 صباحًا - 6 مساءً",
        },
    ]

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ContactPage",
                        name: "مركز المساعدة - اتحاد شباب تحيا مصر",
                        description: "مركز المساعدة والدعم الفني لاتحاد شباب تحيا مصر",
                        url: "https://tahyamisryu.com/help",
                        mainEntity: {
                            "@type": "Organization",
                            name: "اتحاد شباب تحيا مصر",
                            url: "https://tahyamisryu.com",
                            contactPoint: [
                                {
                                    "@type": "ContactPoint",
                                    telephone: "+20-123-456-7890",
                                    contactType: "customer support",
                                    areaServed: "EG",
                                    availableLanguage: "ar",
                                },
                                {
                                    "@type": "ContactPoint",
                                    email: "support@tahyamisryu.com",
                                    contactType: "customer support",
                                    areaServed: "EG",
                                    availableLanguage: "ar",
                                },
                            ],
                        },
                    }),
                }}
            />

            <div className="min-h-screen bg-background" dir="rtl">
                {/* Hero Section */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto">
                            <HeadphonesIcon className="w-16 h-16 mx-auto mb-6 animate-float" />
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-arabic">مركز المساعدة</h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-arabic">
                                نحن هنا لمساعدتك في أي وقت. ابحث عن إجابات أو تواصل مع فريق الدعم
                            </p>
                            <HelpClient faqItems={faqItems} />
                        </div>
                    </div>
                </section>

                {/* Support Options */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-arabic">كيف يمكننا مساعدتك؟</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-arabic">
                                اختر الطريقة الأنسب للتواصل معنا والحصول على المساعدة التي تحتاجها
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {supportOptions.map((option, index) => (
                                <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                                    <CardContent className="p-8">
                                        <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-6">
                                            <option.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-4 font-arabic">{option.title}</h3>
                                        <p className="text-muted-foreground mb-6 font-arabic">{option.description}</p>
                                        <div className="space-y-2">
                                            <div className="font-semibold text-foreground">{option.contact}</div>
                                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-arabic">{option.availability}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

// export default HelpPage
