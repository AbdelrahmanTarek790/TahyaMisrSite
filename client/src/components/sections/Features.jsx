import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Users, Globe, Heart, BookOpen, Crown, Shield } from "lucide-react"
import { Link } from "react-router-dom"
import TheRoadOfRepublicForum from "@/assets/the-road-of-new-republic-forum.jpg"
import ArabYouthSummit from "@/assets/Arab-youth-summit.jpg"
import NationalForumforAwarenessBuilding from "@/assets/build-forum.jpg"
import NationalInitiativeforConstructionandEmpowerment from "@/assets/assign.jpg"
import Teasure27 from "@/assets/tresure27.jpg"
import FemaleLeaders from "@/assets/Female-leaders.jpg"
import CommunityInitiative from "@/assets/wqaya.jpg"
import RadioTahiaMisr from "@/assets/RadioTahiaMisr.jpg"
import NewsTahiaMisr from "@/assets/newsTahiaMisr.jpg"
import StudentTahiaMisr from "@/assets/StudentUnuion.jpg"
import Eaeat from "@/assets/EAEAT.jpg"

import { SimpleInViewSection, SimpleInViewStagger } from "@/components/ui/SimpleMotionComponents"
import { InViewSection, InViewStagger } from "../ui/MotionComponents"

const Features = () => {
    const achievements = [
        {
            icon: Globe,
            title: "منتدي الطريق الى الجمهوريه الجديدة",
            description:
                "منصة حوارية تهدف الي الجمع بين شباب الجمهورية ، للمشاركة والتعبير عن آرائهم ، والخروج بتوصيات ومبادرات من خلال المناقشات الواسعة وتبادل الأفكار والخبرات ، ويأتي ذلك من خلال الجلسات وورش العمل بين الشباب والمتخصصين وقادة الفكر والشخصيات العامة في المجتمع.",
            highlights: [
                "الإستراتيجية الوطنية لحقوق الإنسان",
                "الأمن القومي والتنمية السياسية",
                "التغير المناخي والبيئة المستدامة",
                "دور الشباب في تطبيق رؤية مصر 2030",
            ],
            color: "text-egypt-red",
            image: TheRoadOfRepublicForum,
        },
        {
            icon: Crown,
            title: "القمه الشبابية العربيه",
            description:
                "حاضنة رئيسية لتطلعات وطموح الشباب العربي من خلال دعمها وتشجيعها العديد من المبادرات والبرامج للارتقاء بدورهم ، وتستهدف تمكين الشباب العربي واشراكهم في العمل الشبابي والمجتمعي، وبناء وعيهم بأهم قضايا الوطن العربي المشتركة.",
            highlights: ["تعزيز الهوية العربية", "دعم الابتكار والمعرفة", "التنمية المستدامة", "الشراكة مع جامعة الدول العربية"],
            color: "text-egypt-gold",
            image: ArabYouthSummit,
        },
        {
            icon: BookOpen,
            title: "المنتدي الوطني لبناء الوعي",
            description:
                "تحت شعار « شباب واعى نحو ريادة المستقبل « منصة حوارية هدفها نشر وتعزيز الوعى لدى الشباب ومناقشة الموضوعات المعاصرة ورؤيتهم فى التعامل معها للمساهمه في تنفيذ المشروعات التنموية التى تدعم رؤية مصر 2030 وتتصدى لحروب الجيل الرابع.",
            highlights: ["نشر الوعي بين الشباب", "مناقشة القضايا المعاصرة", "دعم رؤية مصر 2030", "التصدي لحروب الجيل الرابع"],
            color: "text-egypt-red",
            image: NationalForumforAwarenessBuilding,
        },
        {
            icon: Users,
            title: "المبادرة الوطنية للبناء والتمكين",
            description:
                'يهدف المشروع إلى تمكين الشباب من تطوير مهاراتهم وتعزيز قدراتهم، من خلال توفير بيئة داعمة تجمع بين التدريب العملي، العمل التطوعي، والإرشاد المهني. بما يتماشى مع الرؤية الوطنية لمبادرة "بداية".',
            highlights: ["التدريب العملي المتخصص", "العمل التطوعي المنظم", "الإرشاد المهني", "بناء القدرات الشبابية"],
            color: "text-egypt-gold",
            image: NationalInitiativeforConstructionandEmpowerment,
        },
        {
            icon: Award,
            title: "المبادرة الوطنية كنوز ال٢٧",
            description:
                "يسعي فريق كنوز ال27 أن يكون رائد في نشر الوعي الأثري والتاريخي والتصدي للخرافات والشائعات من خلال حملته لإيصال مفهوم التاريخ الصحيح بشكل مبسط وشيق لأكبر فئة من المجتمع من خلال عمل زيارات ميدانية للأماكن أثرية.",
            highlights: ["نشر الوعي الأثري والتاريخي", "التصدي للخرافات والشائعات", "زيارات ميدانية للمواقع الأثرية", "تغطية جميع محافظات الجمهورية"],
            color: "text-egypt-red",
            image: Teasure27,
        },
        {
            icon: Crown,
            title: "المبادرة الوطنية رائدات مصر",
            description:
                "نسعى من خلالها إلى دعم وتمكين المرأة المصرية في مختلف المجالات، ورفع وعيها بقدراتها وإمكاناتها لتكون عنصرًا فاعلًا في تنمية المجتمع. تأتي هذه المبادرة انطلاقًا من إيماننا العميق بأهمية دور المراه في قيادة التغيير الإيجابي.",
            highlights: ["برامج تدريبية متخصصة", "ورش عمل عملية", "مساحات حوارية تفاعلية", "تمكين المرأة اقتصادياً ومجتمعياً"],
            color: "text-egypt-gold",
            image: FemaleLeaders,
        },
        {
            icon: Heart,
            title: "المبادرة المجتمعيه وقايه تحيا مصر",
            description:
                "تتمحور حول التثقيف المجتمعي وتعزيز الوعي العام حول مجموعة من القضايا المحددة فضلا عن تشجيع الفرص الواعدة المتاحة وإحداث تغيير إيجابي يعود بالفائدة على المجتمع ، وخاصة تسليط الضوء على أهمية الكشف المبكر والوقاية من سرطان الثدي.",
            highlights: ["التثقيف الصحي المجتمعي", "الكشف المبكر لسرطان الثدي", "دعم صحة المرأة المصرية", "تنفيذ رؤية مصر 2030 الصحية"],
            color: "text-egypt-red",
            image: CommunityInitiative,
        },
    ]

    return (
        <section className="py-10 bg-background">
            <div className="container mx-auto px-6">
                <SimpleInViewSection animation="fadeInUp" className="text-center mb-16">
                    <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6 font-arabic">
                        🔹 <span className="text-egypt-gold  animate-gradient">إنجازات ومشروعات 🔹</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        مشروعاتنا ومبادراتنا التي تهدف إلى تمكين الشباب المصري وخدمة المجتمع في مختلف المجالات
                    </p>
                </SimpleInViewSection>

                <SimpleInViewStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8" staggerDelay={0.2}>
                    {achievements.map((achievement, index) => (
                        <Card key={index} className="bg-card border-border card-hover group h-full overflow-hidden">
                            {/* Project Image */}
                            <div className="aspect-video bg-gradient-to-br from-egypt-red/10 to-egypt-gold/10 flex items-center justify-center overflow-hidden">
                                <img
                                    src={achievement.image}
                                    alt={achievement.title}
                                    className="object-cover w-[250px] group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-br from-egypt-red to-egypt-gold rounded-full flex items-center justify-center group-hover:animate-float`}
                                    >
                                        <achievement.icon className="w-6 h-6 text-white group-hover:animate-pulse" />
                                    </div>
                                    <CardTitle className="text-xl text-foreground font-arabic text-right flex-1 group-hover:text-egypt-red transition-colors duration-300">
                                        {achievement.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground leading-relaxed text-right font-arabic">{achievement.description}</p>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-foreground text-right font-arabic">أبرز المحاور:</h4>
                                    <ul className="space-y-1">
                                        {achievement.highlights.map((highlight, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex  items-center gap-2 font-arabic">
                                                <span className="w-2 h-2 bg-egypt-gold rounded-full"></span>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </SimpleInViewStagger>

                {/* Union Activities Section */}
                <InViewSection animation="fadeInUp" delay={0.3} className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 font-arabic">
                            🔹 <span className="text-egypt-gold">أهم الأنشطة المندرجة تحت الاتحاد 🔹</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic">
                            الأنشطة والكيانات المركزية التي تعمل تحت مظلة اتحاد شباب تحيا مصر
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-egypt-red/5 to-egypt-gold/5 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-8 text-center font-arabic">🔹 أنشطة مركزية 🔹</h3>

                        <InViewStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.2}>
                            {[
                                {
                                    title: "أسرة اتحاد طلاب تحيا مصر بالأكاديمية المصرية للهندسة والتكنولوجيا المتقدمة",
                                    img: Eaeat,
                                    color: "bg-gradient-to-br from-blue-500 to-blue-600",
                                },
                                {
                                    title: "اتحاد طلاب مدارس تحيا مصر",
                                    img: StudentTahiaMisr,
                                    color: "bg-gradient-to-br from-egypt-red to-red-600",
                                },

                                {
                                    title: "جريدة تحيا مصر",
                                    img: NewsTahiaMisr,
                                    color: "bg-gradient-to-br from-egypt-gold to-yellow-600",
                                },
                                {
                                    title: "راديو تحيا مصر",
                                    img: RadioTahiaMisr,
                                    color: "bg-gradient-to-br from-purple-500 to-purple-600",
                                },
                            ].map((activity, index) => (
                                <Card
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm border-2 h-full border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <CardHeader className="text-center pb-4 ">
                                        <img src={activity.img} alt={activity.title} className="w-32  text-white" />
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <h4 className="text-lg font-semibold text-foreground leading-tight font-arabic text-right px-2">
                                            {activity.title}
                                        </h4>
                                    </CardContent>
                                </Card>
                            ))}
                        </InViewStagger>

                        <div className="mt-8 text-center">
                            <p className="text-muted-foreground font-arabic">
                                هذه الأنشطة تمثل الذراع التنفيذي للاتحاد في مختلف المجالات التعليمية والإعلامية والمجتمعية
                            </p>
                        </div>
                    </div>
                </InViewSection>

                <div className="mt-16 text-center">
                    <div className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] rounded-xl p-8 shadow-card">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-arabic">انضم إلى مسيرة التنمية والبناء</h3>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto font-arabic">
                            كن جزءاً من هذه المشروعات والمبادرات التي تهدف إلى بناء مستقبل أفضل لمصر وشبابها
                        </p>
                        <Link to="/join">
                            <button className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300 font-arabic">
                                انضم إلينا الآن
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
