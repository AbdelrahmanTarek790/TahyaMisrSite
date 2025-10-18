import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import { Users, Crown, Award, Mail, Linkedin, Facebook, ArrowLeft, User, Shield, Target, BookOpen, Heart, Globe } from "lucide-react"
import { SEOMetadata } from "../../components/SEOMetadata"
import image1 from "@/assets/1.jpeg"
import image2 from "@/assets/2.jpeg"
import image3 from "@/assets/3.jpeg"
import image4 from "@/assets/4.jpeg"
import image5 from "@/assets/5.jpeg"
import image6 from "@/assets/6.jpeg"
import image7 from "@/assets/7.jpeg"
import image8 from "@/assets/8.jpeg"
import image9 from "@/assets/9.jpeg"
import image10 from "@/assets/10.jpeg"
import image11 from "@/assets/11.jpeg"

const TeamPage = () => {
    // Board Members data
    const boardMembers = [
        // {
        //     id: 1,
        //     name: "مصطفى أشرف نعمان عبدالجابر قطامش",
        //     position: "رئيس مجلس الإدارة",
        //     description: "يتولى قيادة مجلس الإدارة ووضع الاستراتيجيات العامة للاتحاد",
        //     image: "/api/placeholder/300/300",
        //     governorate: "القاهرة",
        //     specialties: ["القيادة الاستراتيجية", "إدارة المؤسسات", "التخطيط"],
        //     social: {
        //         email: "chairman@tahyamisryu.com",
        //         linkedin: "#",
        //         facebook: "#",
        //     },
        // },
        {
            id: 2,
            name: "ناصر حسن خليل سليمان زغلان",
            position: "نائب رئيس مجلس الإدارة",
            description: "يساعد رئيس المجلس في تنسيق الأعمال وتنفيذ القرارات",
            image: image2,
            governorate: "القاهرة",
            specialties: ["التنسيق الإداري", "متابعة التنفيذ", "الإدارة"],
            social: {
                email: "vice.chairman@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 3,
            name: "هدى مصطفى عبد العزيز إبراهيم",
            position: "أمين الصندوق",
            description: "مسؤولة عن الشؤون المالية وإدارة موارد الاتحاد",
            image: image3,
            governorate: "القاهرة",
            specialties: ["الإدارة المالية", "المحاسبة", "التخطيط المالي"],
            social: {
                email: "treasurer@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 9,
            name: "إيمان عبد الجابر",
            position: "رئيس الإدارة المركزية للتعليم المدني ورئيس الجهة الإدارية المركزية",
            description: "تتولى الإشراف على الإدارة المركزية وبرامج التعليم المدني",
            image: image9,
            governorate: "القاهرة",
            specialties: ["الإدارة المركزية", "التعليم المدني", "الإشراف العام"],
            social: {
                email: "admin.head@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 11,
            name: "الدكتور/ محمد غنيم",
            position: "مدير عام الاداره العامه للتعليم المدني",
            description: "يشرف على جميع برامج التعليم المدني ويضمن جودتها وفعاليتها",
            image: image11,
            governorate: "القاهرة",
            specialties: ["التمثيل الإداري", "اللجان", "التنسيق"],
            social: {
                email: "admin.rep@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 10,
            name: "خالد فوزي محمد محمد",
            position: "ممثل الجهة الإدارية",
            description: "يمثل الجهة الإدارية في اللجان والاجتماعات الرسمية",
            image: image10,
            governorate: "القاهرة",
            specialties: ["التمثيل الإداري", "اللجان", "التنسيق"],
            social: {
                email: "admin.rep@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 4,
            name: "أحمد حلمي محمد محمود احمد",
            position: "عضو مجلس الإدارة ورئيس المجلس الاستشاري",
            description: "يقدم الاستشارات الاستراتيجية ويشارك في اتخاذ القرارات المهمة",
            image: image4,
            governorate: "القاهرة",
            specialties: ["الاستشارات", "التخطيط الاستراتيجي", "القيادة"],
            social: {
                email: "advisory@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },

        {
            id: 5,
            name: "محمود اشرف محمود احمد",
            position: "عضو مجلس الإدارة",
            description: "يشارك في وضع السياسات ومتابعة تنفيذ أهداف الاتحاد",
            image: image5,
            governorate: "القاهرة",
            specialties: ["السياسات", "المتابعة", "التطوير المؤسسي"],
            social: {
                email: "member1@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 6,
            name: "محمد عبده حسن سباعي",
            position: "عضو مجلس الإدارة",
            description: "يساهم في تطوير استراتيجيات الاتحاد ومتابعة الأنشطة",
            image: image6,
            governorate: "القاهرة",
            specialties: ["التطوير", "الأنشطة", "التنسيق"],
            social: {
                email: "member2@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 7,
            name: "أحمد ناجي محمد أحمد",
            position: "عضو مجلس الإدارة",
            description: "يعمل على تعزيز دور الاتحاد في المجتمع وتطوير البرامج",
            image: image7,
            governorate: "القاهرة",
            specialties: ["البرامج", "التطوير", "العلاقات المجتمعية"],
            social: {
                email: "member3@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
        {
            id: 8,
            name: "إسلام فارس عبد الجليل غيث",
            position: "عضو مجلس الإدارة",
            description: "يساهم في تطوير الأنشطة الشبابية والمبادرات المجتمعية",
            image: image8,
            governorate: "القاهرة",
            specialties: ["الأنشطة الشبابية", "المبادرات", "التطوير"],
            social: {
                email: "member4@tahyamisryu.com",
                linkedin: "#",
                facebook: "#",
            },
        },
    ]

    // Administrative Leadership
    const administrativeLeadership = []

    const departments = [
        {
            name: "الإدارة التنفيذية",
            icon: Crown,
            color: "bg-egypt-red/10 text-egypt-red",
            description: "المسؤولة عن وضع الاستراتيجيات والتوجيهات العامة للاتحاد",
        },
        {
            name: "الإعلام والتسويق",
            icon: Globe,
            color: "bg-blue-500/10 text-blue-600",
            description: "تختص بإدارة المحتوى والحملات التوعوية ووسائل التواصل",
        },
        {
            name: "الأنشطة والفعاليات",
            icon: Award,
            color: "bg-green-500/10 text-green-600",
            description: "تنظم وتنسق جميع الأنشطة والفعاليات الشبابية والمجتمعية",
        },
        {
            name: "التطوير التقني",
            icon: Target,
            color: "bg-purple-500/10 text-purple-600",
            description: "مسؤولة عن تطوير المنصات الرقمية والحلول التقنية",
        },
        {
            name: "التدريب والتطوير",
            icon: BookOpen,
            color: "bg-orange-500/10 text-orange-600",
            description: "تقدم البرامج التدريبية وورش تطوير المهارات للأعضاء",
        },
        {
            name: "العلاقات المجتمعية",
            icon: Heart,
            color: "bg-pink-500/10 text-pink-600",
            description: "تبني شراكات مع المؤسسات وتنظم الأعمال التطوعية",
        },
    ]

    return (
        <>
            <SEOMetadata pageKey="team" locale="ar" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
                {/* Header Section */}
                <div className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="flex items-center justify-center mb-6">
                                <Users className="w-12 h-12 ml-4" />
                                <h1 className="text-4xl md:text-6xl font-bold">أعضاء مجلس الإدارة</h1>
                            </div>
                            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                                تعرف علي أعضاء مجلس الإدارة الذين يقودون اتحاد شباب تحيا مصر نحو تحقيق رؤيتنا في بناء جيل شبابي قادر على قيادة
                                المستقبل
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                                    <Crown className="w-5 h-5 ml-2" />
                                    قيادة ملهمة
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                                    <Award className="w-5 h-5 ml-2" />
                                    خبرة واسعة
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                                    <Heart className="w-5 h-5 ml-2" />
                                    شغف بالتغيير
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Board Members Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">أعضاء مجلس الإدارة</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                يضم مجلس الإدارة مجموعة من القيادات المتميزة التي تعمل على توجيه الاتحاد نحو تحقيق أهدافه
                            </p>
                        </div>
                        {/* make the leader in charge of the board */}
                        <div className="flex justify-center mb-12">
                            <Card className="group  transition-all duration-500 hover:-translate-y-2 lg:w-[32%] bg-white border-0 shadow-card overflow-hidden">
                                <div className="relative">
                                    <div className="h-64  flex items-center justify-center">
                                        {/* <User className="w-24 h-24 text-egypt-red/30" /> */}
                                        <img src={image1} alt="مصطفى أشرف نعمان عبدالجابر قطامش" className=" w-full h-full object-contain " />
                                    </div>
                                    <div className="absolute top-4 right-4"></div>
                                </div>

                                <CardContent className="p-6">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">مصطفى أشرف نعمان عبدالجابر قطامش</h3>
                                        <Badge variant="outline" className="text-egypt-red border-egypt-red/30 mb-3 text-center leading-tight">
                                            <Crown className="w-4 h-4 ml-1 flex-shrink-0" />
                                            <span className="text-xs">رئيس مجلس الإدارة</span>
                                        </Badge>
                                        {/* <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                                            يتولى قيادة مجلس الإدارة ووضع الاستراتيجيات العامة للاتحاد
                                        </p> */}
                                    </div>

                                    {/* <div className="space-y-3 mb-6">
                                    <div className="space-y-2">
                                        <span className="text-sm text-muted-foreground">التخصصات:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {member.specialties.map((specialty, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div> */}

                                    {/* <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
                                    <Button size="sm" variant="outline" className="p-2">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="p-2">
                                        <Linkedin className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="p-2">
                                        <Facebook className="w-4 h-4" />
                                    </Button>
                                </div> */}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {boardMembers.map((member) => (
                                <Card
                                    key={member.id}
                                    className="group  transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-card overflow-hidden"
                                >
                                    <div className="relative">
                                        <div className="h-64  flex items-center justify-center">
                                            {/* <User className="w-24 h-24 text-egypt-red/30" /> */}
                                            <img src={member.image} alt={member.name} className="w-full h-full object-contain" />
                                        </div>
                                        {/* <div className="absolute top-4 right-4">
                                        <Badge className="bg-egypt-red text-white">{member.governorate}</Badge>
                                    </div> */}
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{member.name}</h3>
                                            <Badge variant="outline" className="text-egypt-red border-egypt-red/30 mb-3 text-center leading-tight">
                                                <Crown className="w-4 h-4 ml-1 flex-shrink-0" />
                                                <span className="text-xs">{member.position}</span>
                                            </Badge>
                                            {/* <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{member.description}</p> */}
                                        </div>

                                        {/* <div className="space-y-3 mb-6">
                                        <div className="space-y-2">
                                            <span className="text-sm text-muted-foreground">التخصصات:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {member.specialties.map((specialty, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div> */}

                                        {/* <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
                                        <Button size="sm" variant="outline" className="p-2">
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" className="p-2">
                                            <Linkedin className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" className="p-2">
                                            <Facebook className="w-4 h-4" />
                                        </Button>
                                    </div> */}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Administrative Leadership Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">الجهة الإدارية المركزية</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                القيادات الإدارية المسؤولة عن تنفيذ السياسات وإدارة العمليات اليومية للاتحاد
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {administrativeLeadership.map((member) => (
                                <Card
                                    key={member.id}
                                    className="group hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-card overflow-hidden"
                                >
                                    <div className="relative">
                                        <div className="h-64 bg-gradient-to-br from-blue-500/10 to-green-500/10 flex items-center justify-center">
                                            <User className="w-24 h-24 text-blue-600/30" />
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-blue-600 text-white">{member.governorate}</Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{member.name}</h3>
                                            <Badge variant="outline" className="text-blue-600 border-blue-600/30 mb-3 text-center leading-tight">
                                                <Shield className="w-4 h-4 ml-1 flex-shrink-0" />
                                                <span className="text-xs">{member.position}</span>
                                            </Badge>
                                            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{member.description}</p>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="space-y-2">
                                                <span className="text-sm text-muted-foreground">التخصصات:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {member.specialties.map((specialty, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {specialty}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
                                            <Button size="sm" variant="outline" className="p-2">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="p-2">
                                                <Linkedin className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="p-2">
                                                <Facebook className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Departments Section */}
                {/* <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">الأقسام والإدارات</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            يتكون الاتحاد من عدة أقسام متخصصة تعمل بتناغم لتحقيق أهدافنا المشتركة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-card"
                            >
                                <CardContent className="p-6 text-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dept.color} group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <dept.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">{dept.name}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{dept.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}

                {/* Join Team Section */}
                {/* <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white border-0 shadow-elegant">
                            <CardContent className="p-8 md:p-12 text-center">
                                <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
                                <h3 className="text-3xl md:text-4xl font-bold mb-6">انضم إلى فريق العمل</h3>
                                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    نحن نبحث دائماً عن كوادر شبابية متميزة للانضمام إلى فريقنا والمساهمة في تحقيق رؤيتنا لمستقبل أفضل لمصر
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild size="lg" className="bg-white text-egypt-red hover:bg-white/90 font-semibold px-8 py-3">
                                        <Link to="/join">
                                            <Users className="w-5 h-5 ml-2" />
                                            قدم طلب انضمام
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-egypt-red font-semibold px-8 py-3"
                                    >
                                        <Link to="/contact">
                                            <Mail className="w-5 h-5 ml-2" />
                                            تواصل معنا
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section> */}

                {/* Back to Home */}
                <div className="container mx-auto px-6 pb-8">
                    <div className="text-center">
                        <Button asChild variant="outline" size="lg">
                            <Link to="/" className="inline-flex items-center">
                                <ArrowLeft className="w-5 h-5 ml-2" />
                                العودة للصفحة الرئيسية
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeamPage
