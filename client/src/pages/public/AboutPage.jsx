import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Users, Target, Heart, Award, ArrowLeft, VenetianMaskIcon, Mail, Globe, BookOpen, Crown } from "lucide-react"
import { SEOMetadata } from "../../components/SEOMetadata"

const AboutPage = () => {
    const values = [
        {
            icon: VenetianMaskIcon,
            title: "الرؤية",
            description:
                "بناء جيل شبابي مُلهم يمتلك القدرة على التفكير الإبداعي والابتكار، ويشارك بفاعلية في تنمية المجتمع، عبر تمكين الشباب وتطوير قدراتهم ليتحملوا دورًا قياديًا في صناعة مستقبل مستدام ومتوازن للجمهورية الجديدة.",
        },
        {
            icon: Mail,
            title: "الرسالة",
            description:
                "العمل على إعداد كوادر شبابية واعية وقادرة، من خلال تعزيز قيم العمل التطوعي والمجتمعي والسياسي، وتوفير مساحات وفرص حقيقية للتمكين والمشاركة الفعّالة في خدمة الوطن.",
        },
        {
            icon: Target,
            title: "الهدف",
            description:
                "إعداد جيل مؤهل من الشباب المصري يمتلك الوعي والقدرة على القيادة والمشاركة في تنفيذ خطة الدولة للتنمية، مع توجيه طاقتهم نحو العمل والإنتاج والإبداع، وتعزيز روح التعاون والانتماء، بما يسهم في تحقيق أهداف الجمهورية الجديدة.",
        },
    ]

    const coreValues = [
        {
            icon: Users,
            title: "الوحدة",
            description: "جمع الشباب من خلفيات متنوعة للعمل نحو أهداف مشتركة",
            color: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: Award,
            title: "التميز",
            description: "السعي لأعلى المعايير في التعليم والقيادة والخدمة",
            color: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            icon: Heart,
            title: "الخدمة",
            description: "تكريس أنفسنا لخدمة مجتمعاتنا والمساهمة في تقدم مصر",
            color: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ]

    const activities = [
        {
            title: "تمثيل الشباب",
            description: "الدفاع عن حقوق ومصالح الشباب على مستوى الجامعة والمستوى الوطني",
            icon: Users,
        },
        {
            title: "تطوير القيادة",
            description: "تنظيم ورش عمل وبرامج تدريبية لتطوير مهارات القيادة الشبابية",
            icon: Crown,
        },
        {
            title: "خدمة المجتمع",
            description: "تنسيق الأنشطة التطوعية وبرامج التواصل المجتمعي",
            icon: Heart,
        },
        {
            title: "الفعاليات الثقافية",
            description: "استضافة الأنشطة الثقافية التي تحتفل بالتراث المصري وتعزز الوحدة",
            icon: Globe,
        },
        {
            title: "الدعم الأكاديمي",
            description: "توفير الموارد وأنظمة الدعم لمساعدة الشباب على النجاح أكاديمياً",
            icon: BookOpen,
        },
        {
            title: "التواصل والشبكات",
            description: "إنشاء روابط بين الشباب والخريجين والمهنيين في الصناعة",
            icon: Target,
        },
    ]

    return (
        <>
            <SEOMetadata pageKey="about" locale="ar" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-arabic animate-slide-up">عن اتحاد شباب تحيا مصر</h1>
                        <p
                            className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed font-arabic text-center animate-slide-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            اتحاد شبابي مصري يجمع بين مختلف التوجهات الشبابية تحت مظلة واحدة ، و يسعى إلى حل قضايا وتحديات حيوية تواجه المجتمع المصرى
                            ،خاصة الشباب اعتمادا على رؤية شبابية متجددة لتعزيز تنمية الوطن والتقدم به نحو آفاق أفضل
                        </p>
                    </div>
                </section>

                {/* Mission, Vision & Goals */}
                <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-fade-in">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-arabic">
                                <span className="text-egypt-red">رؤيتنا ورسالتنا</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic">
                                الأسس التي نبني عليها عملنا وطموحاتنا للمستقبل
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {values.map((value, index) => (
                                <Card
                                    key={index}
                                    className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 group animate-scale-in"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float transition-all duration-300">
                                            <value.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-3 font-arabic">{value.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed font-arabic text-right">{value.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">قيمنا الأساسية</h2>
                            <p className="text-lg text-gray-600 font-arabic">المبادئ التي توجه كل ما نقوم به</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {coreValues.map((value, index) => (
                                <div key={index} className="text-center group animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div
                                        className={`${value.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 font-arabic">{value.title}</h3>
                                    <p className="text-gray-600 font-arabic text-center">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What We Do */}
                <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">ما نقوم به</h2>
                            <p className="text-lg text-gray-600 font-arabic">أنشطتنا ومبادراتنا التي تحدث فرقاً</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activities.map((activity, index) => (
                                <Card
                                    key={index}
                                    className="bg-white border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <activity.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold mb-3 font-arabic text-right">{activity.title}</h4>
                                        <p className="text-gray-600 font-arabic text-right leading-relaxed">{activity.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Join Us */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-arabic animate-slide-up">كن جزءاً من الأتحاد</h2>
                        <p
                            className="text-xl mb-8 max-w-2xl mx-auto font-arabic text-right leading-relaxed animate-slide-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            انضم إلى آلاف الشباب المصريين الذين يحدثون فرقاً. معاً، يمكننا بناء مستقبل أفضل لمصر.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-scale-in" style={{ animationDelay: "0.4s" }}>
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    className="bg-white text-egypt-red hover:bg-gray-100 px-8 py-3 font-arabic hover:scale-105 transition-all duration-300"
                                >
                                    انضم الآن
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button
                                    size="lg"
                                    variant="outline-hero"
                                    className="border-white border-2  text-white hover:bg-white hover:text-egypt-red px-8 py-3 font-arabic hover:scale-105 transition-all duration-300"
                                >
                                    اتصل بنا
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default AboutPage
