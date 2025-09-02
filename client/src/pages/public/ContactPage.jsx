import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { MapPin, Mail, Phone, Clock, ArrowLeft, Send, MessageCircle, Users, HeadphonesIcon } from "lucide-react"
import { useState } from "react"

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: Handle form submission
        console.log("Contact form submitted:", formData)
        alert("شكراً لك على رسالتك! سنتواصل معك قريباً.")
        setFormData({ name: "", email: "", subject: "", message: "" })
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: "العنوان",
            details: ["ميدان التحرير", "القاهرة، مصر", "11511"],
            color: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: Mail,
            title: "البريد الإلكتروني",
            details: ["contact@tahyamisr.org", "info@tahyamisr.org"],
            color: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            icon: Phone,
            title: "الهاتف",
            details: ["+20 123 456 7890", "+20 987 654 3210"],
            color: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            icon: Clock,
            title: "مواعيد العمل",
            details: ["الأحد - الخميس: 9:00 ص - 5:00 م", "الجمعة - السبت: مغلق"],
            color: "bg-orange-100",
            iconColor: "text-orange-600",
        },
    ]

    const faqs = [
        {
            question: "كيف يمكنني الانضمام إلى اتحاد شباب تحيا مصر؟",
            answer: "يمكنك الانضمام من خلال التسجيل على منصتنا. ببساطة اضغط على زر 'التسجيل' واملأ نموذج التسجيل بمعلوماتك الجامعية والشخصية.",
        },
        {
            question: "هل العضوية مجانية؟",
            answer: "نعم، العضوية في اتحاد شباب تحيا مصر مجانية تماماً لجميع الطلاب المصريين. نحن نؤمن بجعل منصتنا متاحة للجميع.",
        },
        {
            question: "هل يمكنني التطوع في الفعاليات؟",
            answer: "بالطبع! نرحب بالمتطوعين في فعالياتنا وأنشطتنا. بمجرد تسجيلك، يمكنك التقدم لمناصب التطوع من خلال لوحة التحكم الخاصة بك.",
        },
        {
            question: "كيف يمكنني الإبلاغ عن مشكلة؟",
            answer: "يمكنك الإبلاغ عن أي مشاكل من خلال نموذج الاتصال هذا، أو عبر البريد الإلكتروني، أو من خلال قسم الدعم في لوحة التحكم بعد تسجيل الدخول.",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 font-arabic animate-slide-up">تواصل معنا</h1>
                    <p
                        className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed font-arabic text-center animate-slide-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        هل لديك أسئلة أو اقتراحات أو تريد المشاركة؟ نحن نحب أن نسمع منك!
                    </p>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-arabic">
                            <span className="text-egypt-red">معلومات التواصل</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic">تواصل معنا من خلال أي من الطرق التالية</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {contactInfo.map((info, index) => (
                            <Card
                                key={index}
                                className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 group animate-scale-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardContent className="p-6 text-center">
                                    <div
                                        className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <info.icon className={`w-8 h-8 ${info.iconColor}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3 font-arabic">{info.title}</h3>
                                    <div className="space-y-1">
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-muted-foreground text-sm font-arabic text-right">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-elegant animate-fade-in">
                            <CardContent className="p-8 md:p-12">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground mb-4 font-arabic">أرسل لنا رسالة</h2>
                                    <p className="text-muted-foreground font-arabic">سنتواصل معك في أقرب وقت ممكن</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                                                الاسم الكامل *
                                            </label>
                                            <Input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="أدخل اسمك الكامل"
                                                className="text-right font-arabic"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                                                البريد الإلكتروني *
                                            </label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="أدخل بريدك الإلكتروني"
                                                className="text-right font-arabic"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                                            الموضوع *
                                        </label>
                                        <Input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="ما هو موضوع رسالتك؟"
                                            className="text-right font-arabic"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                                            الرسالة *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-egypt-red focus:border-egypt-red text-right font-arabic"
                                            placeholder="أخبرنا المزيد عن استفسارك..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white hover:scale-105 transition-all duration-300 font-arabic"
                                    >
                                        <Send className="h-5 w-5 ml-2" />
                                        إرسال الرسالة
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">الأسئلة الشائعة</h2>
                        <p className="text-lg text-gray-600 font-arabic">إجابات سريعة على الأسئلة الشائعة</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {faqs.map((faq, index) => (
                            <Card
                                key={index}
                                className="bg-white border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardContent className="p-6">
                                    <div className="w-10 h-10 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <HeadphonesIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3 font-arabic text-right">{faq.question}</h3>
                                    <p className="text-gray-600 font-arabic text-right leading-relaxed">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-arabic animate-slide-up">هل أنت مستعد للانضمام إلى مجتمعنا؟</h2>
                    <p
                        className="text-xl mb-8 max-w-2xl mx-auto font-arabic text-right leading-relaxed animate-slide-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        لا تنتظر أكثر من ذلك. كن جزءاً من الحركة التي تشكل مستقبل مصر.
                    </p>
                    <Link to="/register">
                        <Button
                            size="lg"
                            className="bg-white text-egypt-red hover:bg-gray-100 px-8 py-3 font-arabic hover:scale-105 transition-all duration-300 animate-scale-in"
                            style={{ animationDelay: "0.4s" }}
                        >
                            سجل الآن
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default ContactPage
