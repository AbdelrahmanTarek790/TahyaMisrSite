import { Card, CardContent } from "@/components/ui/card"
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
                "إعداد جيل مؤهل من الشباب المصري يمتلك الوعي والقدرة على القيادة والمشاركة في تنفيذ خطة الدولة للتنمية، مع توجيه طاقتهم نحو العمل والإنتاج والإبداع، وتعزيز روح التعاون والانتماء، بما يسهم في تحقيق أهداف الجمهورية الجديدة.",
        },
    ]

    return (
        <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 scroll-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
                        عن <span className="text-egypt-red animate-gradient bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(220,38,38))]">الاتحاد</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        اتحاد شباب تحيا مصر هو منصة تهدف إلى تمكين الشباب المصري من خلال التعليم والمشاركة المدنية وخدمة المجتمع. نحن نؤمن بقوة الشباب
                        في تشكيل مستقبل مصر.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {values.map((value, index) => (
                        <Card
                            key={index}
                            className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-card card-hover group stagger-item"
                        >
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float transition-all duration-300">
                                    <value.icon className="h-8 w-8 text-egypt-white animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-egypt-red transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About