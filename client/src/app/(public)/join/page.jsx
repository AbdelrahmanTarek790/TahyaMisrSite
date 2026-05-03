import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle } from "lucide-react"
import JoinForm from "./JoinForm"

// Generate metadata for SEO
export const metadata = {
    title: "انضم إلينا - اتحاد شباب تحيا مصر | Join Us",
    description: "انضم إلى اتحاد شباب تحيا مصر وكن جزءًا من التغيير. قدّم طلب العضوية الآن وشارك في الأنشطة التطوعية والمبادرات الشبابية",
    keywords: "انضم, عضوية, تسجيل, join, membership, registration, تطوع, volunteer, اتحاد شباب تحيا مصر",
    openGraph: {
        title: "انضم إلينا - اتحاد شباب تحيا مصر",
        description: "كن جزءًا من التغيير - انضم إلينا الآن",
        url: "https://tahyamisryu.com/join",
        siteName: "اتحاد شباب تحيا مصر",
        images: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "انضم إلينا - اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "انضم إلينا - اتحاد شباب تحيا مصر",
        description: "قدّم طلب العضوية وكن جزءًا من التغيير",
        images: ["https://tahyamisryu.com/Logo.webp"],
    },
    alternates: {
        canonical: "https://tahyamisryu.com/join",
    },
}

export default function JoinRequestPage() {
    const benefits = [
        "المشاركة في الفعاليات والأنشطة المتنوعة",
        "فرص التطوير الشخصي والمهني",
        "التواصل مع شباب من كل أنحاء مصر",
        "المساهمة في خدمة المجتمع",
        "الحصول على شهادات معتمدة",
        "فرص التطوع والقيادة",
    ]

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: "انضم إلينا - اتحاد شباب تحيا مصر",
                        description: "نموذج التسجيل للانضمام إلى اتحاد شباب تحيا مصر",
                        url: "https://tahyamisryu.com/join",
                        inLanguage: "ar",
                        isPartOf: {
                            "@type": "WebSite",
                            name: "اتحاد شباب تحيا مصر",
                            url: "https://tahyamisryu.com",
                        },
                        potentialAction: {
                            "@type": "RegisterAction",
                            target: "https://tahyamisryu.com/join",
                            name: "تقديم طلب عضوية",
                        },
                    }),
                }}
            />

            <div className="min-h-screen bg-background" dir="rtl">
                {/* Hero Section */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto">
                            <Users className="w-16 h-16 mx-auto mb-6 animate-float" />
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-arabic">انضم إلينا</h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-arabic">
                                كن جزءًا من التغيير وشارك في بناء مستقبل أفضل لمصر
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-arabic">لماذا تنضم إلينا؟</h2>
                            <p className="text-lg text-muted-foreground font-arabic">مزايا العضوية في اتحاد شباب تحيا مصر</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {benefits.map((benefit, index) => (
                                <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                                    <CardContent className="p-6">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
                                        <p className="text-muted-foreground font-arabic">{benefit}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-3xl text-center font-arabic">نموذج طلب العضوية</CardTitle>
                                    <p className="text-center text-muted-foreground mt-2 font-arabic">املأ البيانات التالية وسنتواصل معك قريباً</p>
                                </CardHeader>
                                <CardContent>
                                    <JoinForm />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
