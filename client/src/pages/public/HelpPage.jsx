import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { SEOMetadata } from "../../components/SEOMetadata"
import { ChevronDown, ChevronUp, Search, Phone, Mail, MessageCircle, HeadphonesIcon, Clock, MapPin } from "lucide-react"

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedFaq, setExpandedFaq] = useState(null)

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

    const filteredFaqs = faqItems.filter(
        (item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    return (
        <>
            <SEOMetadata pageKey="help" locale="ar" />
            <div className="min-h-screen bg-background" dir="rtl">
                {/* Hero Section */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto">
                            <HeadphonesIcon className="w-16 h-16 mx-auto mb-6 animate-float" />
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">مركز المساعدة</h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                نحن هنا لمساعدتك في أي وقت. ابحث عن إجابات أو تواصل مع فريق الدعم
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن إجابة لسؤالك..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-4 rounded-lg text-foreground text-right border-0 focus:ring-4 focus:ring-white/20"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support Options */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">كيف يمكننا مساعدتك؟</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                                        <h3 className="text-xl font-bold text-foreground mb-4">{option.title}</h3>
                                        <p className="text-muted-foreground mb-6">{option.description}</p>
                                        <div className="space-y-2">
                                            <div className="font-semibold text-foreground">{option.contact}</div>
                                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {option.availability}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">الأسئلة الشائعة</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                إجابات على الأسئلة الأكثر شيوعًا حول اتحاد شباب تحيا مصر
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            {filteredFaqs.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredFaqs.map((faq, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <CardHeader
                                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                                onClick={() => toggleFaq(index)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-right flex-1 text-lg">{faq.question}</CardTitle>
                                                    {expandedFaq === index ? (
                                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </CardHeader>
                                            {expandedFaq === index && (
                                                <CardContent className="pt-0">
                                                    <p className="text-muted-foreground leading-relaxed text-right">{faq.answer}</p>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-xl text-muted-foreground">لم يتم العثور على نتائج لبحثك. جرب كلمات مختلفة.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Contact Support */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <Card className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] border-0 text-white text-center">
                            <CardContent className="p-12">
                                <h3 className="text-3xl md:text-4xl font-bold mb-6">لم تجد ما تبحث عنه؟</h3>
                                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                    فريق الدعم لدينا مستعد لمساعدتك في أي وقت. تواصل معنا للحصول على إجابات مخصصة لأسئلتك
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button className="bg-white text-egypt-red hover:bg-white/90 font-semibold" size="lg">
                                        <Phone className="w-5 h-5 ml-2" />
                                        اتصل بنا الآن
                                    </Button>
                                    <Button
                                        // variant="outline"
                                        className="border-white border bg-transparent text-white hover:bg-white hover:text-egypt-red font-semibold"
                                        size="lg"
                                    >
                                        <Mail className="w-5 h-5 ml-2" />
                                        أرسل رسالة
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </>
    )
}

export default HelpPage
