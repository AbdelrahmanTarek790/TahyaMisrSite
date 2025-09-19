import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { FileText, Scale, AlertTriangle, CheckCircle, Users, Shield, Gavel, Mail } from "lucide-react"
import { Button } from "../../components/ui/button"

const TermsPage = () => {
    const keyTerms = [
        {
            icon: Users,
            title: "العضوية والانضمام",
            description: "شروط وإجراءات الانضمام إلى اتحاد شباب تحيا مصر وواجبات الأعضاء",
        },
        {
            icon: Shield,
            title: "قواعد السلوك",
            description: "المعايير الأخلاقية والسلوكية المطلوبة من جميع الأعضاء والمشاركين",
        },
        {
            icon: Gavel,
            title: "الحقوق والواجبات",
            description: "حقوق وواجبات كل من الاتحاد والأعضاء في إطار الشراكة",
        },
    ]

    const prohibitedActivities = [
        "استخدام المنصة لأغراض غير قانونية أو ضارة",
        "نشر محتوى مسيء أو تحريضي أو مخالف للآداب العامة",
        "انتحال شخصية الغير أو تقديم معلومات كاذبة",
        "التدخل في عمل المنصة أو محاولة اختراقها",
        "استخدام البيانات الشخصية للأعضاء الآخرين دون إذن",
        "الترويج لخدمات أو منتجات تجارية دون موافقة",
        "إنشاء حسابات متعددة أو وهمية",
        "مشاركة محتوى ينتهك حقوق الملكية الفكرية",
    ]

    const memberResponsibilities = [
        "الالتزام بقيم ومبادئ الاتحاد",
        "المشاركة الإيجابية في الأنشطة والفعاليات",
        "احترام الأعضاء الآخرين والموظفين",
        "الحفاظ على سرية المعلومات الحساسة",
        "الإبلاغ عن أي مخالفات أو مشاكل",
        "تحديث البيانات الشخصية عند الحاجة",
        "اتباع تعليمات الأمان والسلامة",
        "عدم استخدام عضويتك لأغراض شخصية أو تجارية",
    ]

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            {/* Hero Section */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Scale className="w-16 h-16 mx-auto mb-6 animate-float" />
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">شروط الخدمة</h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                            القواعد والشروط التي تحكم استخدامك لخدمات اتحاد شباب تحيا مصر
                        </p>
                        <div className="flex items-center justify-center gap-2 text-lg">
                            <CheckCircle className="w-6 h-6" />
                            <span>سارية المفعول من: سبتمبر 2025</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Terms Overview */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">ملخص الشروط الأساسية</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">فهم سريع للنقاط الرئيسية في شروط الخدمة</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {keyTerms.map((term, index) => (
                            <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <term.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-4">{term.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{term.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Terms */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Acceptance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">1. قبول الشروط</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground text-right leading-relaxed">
                                <p>
                                    باستخدامك لمنصة اتحاد شباب تحيا مصر أو المشاركة في أنشطتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت
                                    لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
                                </p>
                                <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إشعارك بأي تغييرات جوهرية قبل دخولها حيز التنفيذ بفترة معقولة.</p>
                            </CardContent>
                        </Card>

                        {/* Membership */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">2. العضوية والحساب</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground text-right leading-relaxed">
                                <p>
                                    <strong>شروط العضوية:</strong> يجب أن تكون مصري الجنسية وتتراوح أعمارك بين 18-35 عامًا للانضمام كعضو كامل. الأعضاء
                                    تحت سن 18 يحتاجون موافقة ولي الأمر.
                                </p>
                                <p>
                                    <strong>دقة المعلومات:</strong> أنت مسؤول عن ضمان صحة ودقة جميع المعلومات المقدمة في ملفك الشخصي. أي معلومات كاذبة
                                    قد تؤدي إلى إنهاء العضوية.
                                </p>
                                <p>
                                    <strong>أمان الحساب:</strong> أنت مسؤول عن الحفاظ على سرية بيانات دخولك وجميع الأنشطة التي تحدث تحت حسابك.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Prohibited Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                    3. الأنشطة المحظورة
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-6 text-right">يُمنع منعًا باتًا القيام بأي من الأنشطة التالية:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {prohibitedActivities.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                                            <span className="text-muted-foreground text-sm">{activity}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Responsibilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">4. مسؤوليات الأعضاء</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-6 text-right">كعضو في اتحاد شباب تحيا مصر، يتوجب عليك:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {memberResponsibilities.map((responsibility, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                            <span className="text-muted-foreground text-sm">{responsibility}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Intellectual Property */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">5. الملكية الفكرية</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground text-right leading-relaxed">
                                <p>
                                    جميع المحتويات والمواد المنشورة على منصتنا (النصوص، الصور، الفيديوهات، الشعارات) محمية بموجب قوانين الملكية
                                    الفكرية وتخص اتحاد شباب تحيا مصر.
                                </p>
                                <p>
                                    يُسمح لك باستخدام هذه المواد للاستخدام الشخصي غير التجاري فقط. أي استخدام تجاري يتطلب موافقة كتابية مسبقة من
                                    الإدارة.
                                </p>
                                <p>
                                    عند رفع محتوى إلى المنصة، فإنك تمنحنا ترخيصًا غير حصري لاستخدام هذا المحتوى لأغراض الاتحاد مع الحفاظ على حقوق
                                    الملكية الأصلية لك.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Termination */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">6. إنهاء العضوية</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground text-right leading-relaxed">
                                <p>
                                    <strong>الإنهاء الطوعي:</strong> يمكنك إنهاء عضويتك في أي وقت عبر إرسال طلب كتابي لإدارة الاتحاد. سيتم حذف حسابك
                                    خلال 30 يومًا من تاريخ الطلب.
                                </p>
                                <p>
                                    <strong>الإنهاء من قبل الاتحاد:</strong> نحتفظ بالحق في إنهاء العضوية في حالة مخالفة هذه الشروط أو السلوك المضر
                                    بسمعة الاتحاد أو أعضائه.
                                </p>
                                <p>
                                    <strong>ما بعد الإنهاء:</strong> بعد إنهاء العضوية، لن تتمكن من الوصول إلى الخدمات المخصصة للأعضاء، ولكن ستبقى
                                    ملزمًا بالشروط المتعلقة بالسرية والملكية الفكرية.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Liability */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right text-2xl">7. المسؤولية والضمانات</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground text-right leading-relaxed">
                                <p>
                                    اتحاد شباب تحيا مصر يقدم خدماته "كما هي" دون ضمانات صريحة أو ضمنية. نحن نبذل قصارى جهدنا لتقديم خدمة عالية الجودة
                                    ولكن لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء.
                                </p>
                                <p>
                                    لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام خدماتنا، باستثناء الحالات التي ينص فيها
                                    القانون على خلاف ذلك.
                                </p>
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
                            <FileText className="w-12 h-12 mx-auto mb-6" />
                            <h3 className="text-3xl md:text-4xl font-bold mb-6">لديك استفسارات حول الشروط؟</h3>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                فريقنا القانوني مستعد للإجابة على جميع أسئلتك حول شروط الخدمة وتوضيح أي نقاط غامضة
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="bg-white text-egypt-red hover:bg-white/90 font-semibold" size="lg">
                                    <Mail className="w-5 h-5 ml-2" />
                                    تواصل مع الفريق القانوني
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-egypt-red font-semibold"
                                    size="lg"
                                >
                                    <FileText className="w-5 h-5 ml-2" />
                                    اطبع نسخة من الشروط
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default TermsPage
