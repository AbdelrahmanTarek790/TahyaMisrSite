import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Shield, Eye, Lock, Users, FileText, AlertCircle, CheckCircle, Mail } from "lucide-react"
import { Button } from "../../components/ui/button"

const PrivacyPage = () => {
    const privacyPrinciples = [
        {
            icon: Shield,
            title: "الحماية والأمان",
            description: "نستخدم أحدث تقنيات الأمان لحماية بياناتك الشخصية من أي وصول غير مصرح به",
        },
        {
            icon: Eye,
            title: "الشفافية الكاملة",
            description: "نوضح لك بالتفصيل كيف نجمع ونستخدم ونحمي معلوماتك الشخصية",
        },
        {
            icon: Lock,
            title: "التحكم في البيانات",
            description: "لديك السيطرة الكاملة على معلوماتك ويمكنك تعديلها أو حذفها في أي وقت",
        },
    ]

    const dataTypes = [
        {
            category: "البيانات الأساسية",
            items: ["الاسم الكامل", "تاريخ الميلاد", "العنوان", "رقم الهاتف", "البريد الإلكتروني"],
        },
        {
            category: "البيانات التعليمية والمهنية",
            items: ["المؤهل التعليمي", "التخصص", "مكان العمل أو الدراسة", "الخبرات والمهارات"],
        },
        {
            category: "بيانات المشاركة",
            items: ["الأنشطة المشارك بها", "التطوع والمبادرات", "التقييمات والآراء", "الحضور والمشاركة"],
        },
    ]

    const yourRights = [
        "الحق في الوصول إلى بياناتك الشخصية",
        "الحق في تصحيح أو تحديث معلوماتك",
        "الحق في حذف بياناتك (الحق في النسيان)",
        "الحق في تقييد معالجة بياناتك",
        "الحق في نقل بياناتك إلى خدمة أخرى",
        "الحق في الاعتراض على معالجة بياناتك",
        "الحق في سحب موافقتك في أي وقت",
    ]

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            {/* Hero Section */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Shield className="w-16 h-16 mx-auto mb-6 animate-float" />
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">سياسة الخصوصية</h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                            حماية خصوصيتك أولويتنا القصوى. تعرف على كيفية حماية وإدارة بياناتك الشخصية
                        </p>
                        <div className="flex items-center justify-center gap-2 text-lg">
                            <CheckCircle className="w-6 h-6" />
                            <span>آخر تحديث: سبتمبر 2025</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Principles */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">مبادئ الخصوصية لدينا</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">نؤمن بحقك في الخصوصية ونلتزم بأعلى معايير حماية البيانات</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {privacyPrinciples.map((principle, index) => (
                            <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <principle.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-4">{principle.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Data Collection */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">البيانات التي نجمعها</h2>
                            <p className="text-xl text-muted-foreground">نجمع فقط البيانات الضرورية لتقديم خدماتنا وتحسين تجربتك معنا</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {dataTypes.map((type, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-right flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-egypt-red" />
                                            {type.category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {type.items.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-right">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* How We Use Data */}
                        <Card className="mb-12">
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">كيف نستخدم بياناتك</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-3">الأغراض الأساسية:</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• إدارة عضويتك في الاتحاد</li>
                                            <li>• تنظيم وإدارة الفعاليات والأنشطة</li>
                                            <li>• التواصل معك حول الأنشطة والفرص</li>
                                            <li>• تقديم الدعم والمساعدة التقنية</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-3">الأغراض الثانوية:</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• تحسين خدماتنا وتطوير منصاتنا</li>
                                            <li>• إعداد التقارير والإحصائيات</li>
                                            <li>• البحث وتطوير برامج جديدة</li>
                                            <li>• ضمان الأمان ومنع الاحتيال</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Your Rights */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">حقوقك في الخصوصية</h2>
                            <p className="text-xl text-muted-foreground">لديك حقوق كاملة في التحكم في بياناتك الشخصية</p>
                        </div>

                        <Card>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {yourRights.map((right, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-egypt-red flex-shrink-0 mt-1" />
                                            <span className="text-muted-foreground">{right}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Security Measures */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-3xl flex items-center gap-3">
                                    <Lock className="w-8 h-8 text-egypt-red" />
                                    إجراءات الأمان والحماية
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-4">الحماية التقنية:</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• تشفير SSL/TLS لجميع البيانات</li>
                                            <li>• جدران حماية متقدمة</li>
                                            <li>• مراقبة أمنية على مدار الساعة</li>
                                            <li>• نسخ احتياطية منتظمة ومشفرة</li>
                                            <li>• اختبارات اختراق دورية</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-4">الحماية الإدارية:</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• تدريب الموظفين على أمن البيانات</li>
                                            <li>• سياسات صارمة للوصول للبيانات</li>
                                            <li>• اتفاقيات سرية مع جميع الموظفين</li>
                                            <li>• مراجعات أمنية منتظمة</li>
                                            <li>• خطط الاستجابة للحوادث الأمنية</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <Card className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] border-0 text-white text-center">
                        <CardContent className="p-12">
                            <AlertCircle className="w-12 h-12 mx-auto mb-6" />
                            <h3 className="text-3xl md:text-4xl font-bold mb-6">لديك أسئلة حول الخصوصية؟</h3>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                فريق حماية البيانات لدينا مستعد للإجابة على جميع استفساراتك حول سياسة الخصوصية
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="bg-white text-egypt-red hover:bg-white/90 font-semibold" size="lg">
                                    <Mail className="w-5 h-5 ml-2" />
                                    راسل فريق الخصوصية
                                </Button>
                                <Button
                                    // variant="outline"
                                    className="border-white border bg-transparent text-white hover:bg-white hover:text-egypt-red font-semibold"
                                    size="lg"
                                >
                                    <FileText className="w-5 h-5 ml-2" />
                                    اطلب بياناتك الشخصية
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default PrivacyPage
