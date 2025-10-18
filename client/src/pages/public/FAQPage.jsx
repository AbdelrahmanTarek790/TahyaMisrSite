import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { SEOMetadata } from "../../components/SEOMetadata"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import {
    HelpCircle,
    Search,
    Users,
    Calendar,
    Shield,
    Settings,
    CreditCard,
    Globe,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Phone,
    Mail,
} from "lucide-react"

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [expandedFAQ, setExpandedFAQ] = useState(null)

    const categories = [
        { id: "all", name: "جميع الأسئلة", icon: HelpCircle },
        { id: "membership", name: "العضوية", icon: Users },
        { id: "events", name: "الفعاليات", icon: Calendar },
        { id: "security", name: "الأمان", icon: Shield },
        { id: "account", name: "الحساب", icon: Settings },
        { id: "payments", name: "المدفوعات", icon: CreditCard },
        { id: "technical", name: "المساعدة التقنية", icon: Globe },
    ]

    const faqs = [
        {
            id: 1,
            category: "membership",
            question: "كيف يمكنني الانضمام إلى اتحاد شباب تحيا مصر؟",
            answer: "يمكنك الانضمام إلينا عبر ملء استمارة العضوية في موقعنا الإلكتروني. ستحتاج إلى تقديم بياناتك الشخصية، صورة شخصية، وصورة من البطاقة الشخصية. بعد مراجعة طلبك، ستحصل على رد خلال 5 أيام عمل. العضوية متاحة للشباب المصري من عمر 18 إلى 35 عامًا.",
        },
        {
            id: 2,
            category: "membership",
            question: "ما هي شروط العضوية؟",
            answer: "شروط العضوية تتضمن: أن تكون مصري الجنسية، العمر بين 18-35 عامًا، تقديم أوراق ثبوتية صحيحة، الالتزام بقيم ومبادئ الاتحاد، والمشاركة الفعالة في الأنشطة. كما نتطلب عدم وجود سوابق جنائية مخلة بالشرف.",
        },
        {
            id: 3,
            category: "membership",
            question: "هل العضوية مجانية؟",
            answer: "نعم، العضوية الأساسية مجانية تمامًا. ولكن بعض الفعاليات الخاصة أو الدورات التدريبية المتقدمة قد تتطلب رسوم رمزية لتغطية التكاليف. سنقوم بإخطارك مسبقًا عن أي رسوم مطلوبة.",
        },
        {
            id: 4,
            category: "events",
            question: "كيف يمكنني التسجيل في الفعاليات؟",
            answer: "يمكنك التسجيل في الفعاليات من خلال قسم الفعاليات في موقعنا الإلكتروني أو تطبيق الهاتف المحمول. ما عليك سوى اختيار الفعالية المرغوبة والنقر على 'سجل الآن'. ستحصل على تأكيد بالبريد الإلكتروني مع تفاصيل الفعالية.",
        },
        {
            id: 5,
            category: "events",
            question: "هل يمكنني إلغاء تسجيلي في فعالية؟",
            answer: "نعم، يمكنك إلغاء تسجيلك في أي فعالية قبل 48 ساعة من موعدها دون أي رسوم. بعد هذا الموعد، قد تطبق شروط الإلغاء المحددة لكل فعالية. يمكنك إلغاء التسجيل من خلال حسابك الشخصي أو الاتصال بنا.",
        },
        {
            id: 6,
            category: "events",
            question: "هل الحضور إجباري للفعاليات التي سجلت فيها؟",
            answer: "لا، الحضور ليس إجباريًا، ولكننا نشجع الأعضاء على الالتزام بالفعاليات التي يسجلون فيها. عدم الحضور المتكرر دون إشعار قد يؤثر على أولوية قبولك في فعاليات مستقبلية ذات أماكن محدودة.",
        },
        {
            id: 7,
            category: "security",
            question: "كيف تحمون بياناتي الشخصية؟",
            answer: "نستخدم أعلى معايير الأمان لحماية بياناتكم، بما في ذلك التشفير المتقدم وخوادم آمنة. لا نشارك بياناتكم مع أطراف ثالثة إلا بموافقتكم الصريحة. جميع موظفينا ملزمون بعقود سرية صارمة.",
        },
        {
            id: 8,
            category: "security",
            question: "ماذا أفعل إذا تعرض حسابي للاختراق؟",
            answer: "في حالة الاشتباه في اختراق حسابك، اتصل بنا فورًا على الخط الساخن أو البريد الإلكتروني المخصص للأمان. سنقوم بتجميد الحساب مؤقتًا وإرشادك لخطوات استرداده. ننصح بتغيير كلمة المرور فورًا وتفعيل المصادقة الثنائية.",
        },
        {
            id: 9,
            category: "account",
            question: "كيف يمكنني تحديث بياناتي الشخصية؟",
            answer: "يمكنك تحديث بياناتك من خلال قسم 'الملف الشخصي' في حسابك. بعض البيانات الحساسة مثل رقم الهوية قد تتطلب التحقق من خلال رفع مستندات جديدة. التحديثات تصبح سارية فورًا بعد الحفظ.",
        },
        {
            id: 10,
            category: "account",
            question: "هل يمكنني حذف حسابي نهائيًا؟",
            answer: "نعم، يمكنك طلب حذف حسابك نهائيًا عبر إرسال طلب كتابي إلى إدارة الاتحاد. سيتم حذف جميع بياناتك خلال 30 يومًا، باستثناء المعلومات المطلوبة قانونيًا للاحتفاظ بها. هذا الإجراء غير قابل للتراجع.",
        },
        {
            id: 11,
            category: "payments",
            question: "ما هي طرق الدفع المتاحة؟",
            answer: "نقبل الدفع عبر: البطاقات الائتمانية (فيزا/ماستركارد)، المحافظ الإلكترونية (فودافون كاش، أورانج موني، إتصالات كاش)، التحويل البنكي المباشر، أو الدفع النقدي في مقر الاتحاد. جميع المعاملات آمنة ومشفرة.",
        },
        {
            id: 12,
            category: "payments",
            question: "هل يمكنني استرداد المبالغ المدفوعة؟",
            answer: "سياسة الاسترداد تختلف حسب نوع الخدمة. للفعاليات: استرداد كامل قبل 7 أيام، 50% قبل 3 أيام، لا استرداد بعد ذلك. للدورات التدريبية: استرداد كامل قبل بداية الدورة بأسبوع. العضويات المدفوعة غير قابلة للاسترداد.",
        },
        {
            id: 13,
            category: "technical",
            question: "الموقع لا يعمل بشكل صحيح، ماذا أفعل؟",
            answer: "جرب هذه الخطوات: امسح cache المتصفح، تأكد من تحديث المتصفح، جرب متصفح آخر، أعد تشغيل جهازك. إذا استمرت المشكلة، اتصل بالدعم التقني مع ذكر تفاصيل المشكلة ونوع المتصفح المستخدم.",
        },
        {
            id: 14,
            category: "technical",
            question: "كيف أحمل تطبيق الهاتف المحمول؟",
            answer: "تطبيقنا متوفر على Google Play Store للأندرويد و App Store للآيفون. ابحث عن 'اتحاد شباب تحيا مصر' أو استخدم الروابط المباشرة في موقعنا الإلكتروني. التطبيق مجاني تمامًا ولا يحتوي على إعلانات.",
        },
        {
            id: 15,
            category: "technical",
            question: "لماذا لا أتلقى رسائل البريد الإلكتروني؟",
            answer: "تحقق من مجلد الرسائل المرفوضة (Spam) أولاً. تأكد من أن عنوان بريدك الإلكتروني صحيح في ملفك الشخصي. أضف support@tahyamisryu.com إلى قائمة جهات الاتصال الآمنة. إذا استمرت المشكلة، اتصل بنا لتحديث إعدادات البريد.",
        },
    ]

    const filteredFAQs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id)
    }

    return (
        <>
            <SEOMetadata pageKey="faq" locale="ar" />
            <div className="min-h-screen bg-background" dir="rtl">
                {/* Hero Section */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto">
                            <HelpCircle className="w-16 h-16 mx-auto mb-6 animate-float" />
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">الأسئلة الشائعة</h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                إجابات شاملة على أكثر الأسئلة شيوعًا حول خدماتنا وأنشطتنا
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative">
                                <div className="relative">
                                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="ابحث في الأسئلة الشائعة..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pr-12 pl-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-12 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 ${
                                        selectedCategory === category.id
                                            ? "bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white"
                                            : "hover:bg-egypt-red hover:text-white"
                                    }`}
                                >
                                    <category.icon className="w-4 h-4" />
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ List */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            {filteredFAQs.length === 0 ? (
                                <Card className="text-center py-16">
                                    <CardContent>
                                        <HelpCircle className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                                        <h3 className="text-2xl font-bold text-foreground mb-4">لم نجد أسئلة مطابقة</h3>
                                        <p className="text-muted-foreground mb-6">جرب تغيير الفئة أو مصطلح البحث للعثور على الإجابة التي تبحث عنها</p>
                                        <Button
                                            onClick={() => {
                                                setSearchTerm("")
                                                setSelectedCategory("all")
                                            }}
                                        >
                                            عرض جميع الأسئلة
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {filteredFAQs.map((faq) => (
                                        <Card key={faq.id} className="hover:shadow-elegant transition-all duration-300">
                                            <CardHeader className="cursor-pointer select-none" onClick={() => toggleFAQ(faq.id)}>
                                                <CardTitle className="text-right flex items-center justify-between">
                                                    <span className="text-lg">{faq.question}</span>
                                                    {expandedFAQ === faq.id ? (
                                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            {expandedFAQ === faq.id && (
                                                <CardContent className="pt-0">
                                                    <div className="border-t pt-6">
                                                        <p className="text-muted-foreground text-right leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Still Need Help */}
                <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">لم تجد الإجابة؟</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">فريق الدعم جاهز لمساعدتك على مدار الساعة</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <Card className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-4">الدردشة المباشرة</h3>
                                    <p className="text-muted-foreground mb-6">تحدث مع أحد ممثلي الدعم فورًا</p>
                                    <Button className="w-full">ابدأ الدردشة</Button>
                                </CardContent>
                            </Card>

                            <Card className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-4">الخط الساخن</h3>
                                    <p className="text-muted-foreground mb-6">
                                        اتصل بنا على الرقم المجاني
                                        <br />
                                        <strong className="text-foreground">16295</strong>
                                    </p>
                                    <Button variant="outline" className="w-full">
                                        اتصل الآن
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-4">البريد الإلكتروني</h3>
                                    <p className="text-muted-foreground mb-6">
                                        راسلنا على
                                        <br />
                                        <strong className="text-foreground">support@tahyamisryu.com</strong>
                                    </p>
                                    <Button variant="outline" className="w-full">
                                        إرسال رسالة
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default FAQPage
