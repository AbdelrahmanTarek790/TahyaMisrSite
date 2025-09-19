import { Card, CardContent } from "@/components/ui/card"
import { SimpleInViewStagger, SimpleInViewSection } from "@/components/ui/SimpleMotionComponents"
import { Users, Target, Heart, Zap, Mail, VenetianMaskIcon } from "lucide-react"

const About = () => {
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
                "إعداد جيل مؤهل من الشباب المصري يمتلك الوعي والقدرة على القيادة والمشاركة في تنفيذ خطة الدولة للتنمية، مع توجيه طاقتهم نحو العمل والإنتاج والإبداع، وتعزيز روح التعاون والانتماء، بما يسهم في تحقيق أهداف الجمهورية الجديدة.",
        },
    ]

    return (
        <section id="about-section" className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
            <div className="container mx-auto px-6">
                <SimpleInViewSection animation="fadeInUp" className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        عن <span className="text-egypt-red animate-float">الاتحاد</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        اتحاد شباب تحيا مصر هو منصة تهدف إلى تمكين الشباب المصري من خلال التعليم والمشاركة المدنية وخدمة المجتمع. نحن نؤمن بقوة الشباب
                        في تشكيل مستقبل مصر.
                    </p>
                </SimpleInViewSection>

                <SimpleInViewStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" staggerDelay={0.15}>
                    {values.map((value, index) => (
                        <Card
                            key={index}
                            className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 group h-full"
                        >
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float transition-all duration-300">
                                    <value.icon className="w-8 h-8 text-egypt-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </SimpleInViewStagger>

                {/* <div className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-2xl p-8 md:p-12 text-center shadow-elegant animate-bounce-in">
                    <h3 className="text-3xl md:text-4xl font-bold text-egypt-white mb-6 animate-slide-up">
                        انضم إلى الاتحاد
                    </h3>
                    <p className="text-xl text-egypt-white/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        كن جزءًا من شيء أكبر. تواصل مع شباب ذوي تفكير مشابه، وشارك في مبادرات ذات مغزى، وساعد في بناء مصر أقوى للأجيال القادمة.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: "0.4s" }}>
                        <a
                            href="#register"
                            className="inline-flex items-center justify-center px-8 py-3 bg-egypt-white text-egypt-red font-semibold rounded-lg hover:bg-egypt-white/90 transition-all duration-300 hover:scale-105 hover:shadow-glow"
                        >
                            انضم الان
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-egypt-white text-egypt-white font-semibold rounded-lg hover:bg-egypt-white hover:text-egypt-red transition-all duration-300 hover:scale-105"
                        >
                            تواصل معنا
                        </a>
                    </div>
                </div> */}
            </div>
        </section>
    )
}

export default About
