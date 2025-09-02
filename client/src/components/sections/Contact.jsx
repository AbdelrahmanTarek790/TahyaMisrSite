import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "../ui/enhanced-button"

const Contact = () => {
    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            value: "info@longliveegypt.org",
            href: "mailto:info@longliveegypt.org",
        },
        {
            icon: Phone,
            title: "Phone",
            value: "+20 123 456 7890",
            href: "tel:+201234567890",
        },
        {
            icon: MapPin,
            title: "Address",
            value: "Cairo, Egypt",
            href: "#",
        },
    ]

    return (
        <section id="contact" className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        أبقي علي <span className="text-egypt-red">تواصل</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        هل لديك أسئلة حول الانضمام إلى الاتحاد؟ هل ترغب في معرفة المزيد عن مبادراتنا؟ نود أن نسمع منك.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div className="space-y-8 animate-slide-up">
                        <div>
                            <h3 className="text-2xl text-right font-bold text-foreground mb-6">معلومات الاتصال</h3>
                            <div className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="flex flex-row-reverse text-right items-center space-x-4 p-4 rounded-lg bg-card hover:shadow-card transition-all duration-300 group"
                                    >
                                        <div className="w-12 h-12 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                                            <item.icon className="w-6 h-6 text-egypt-white" />
                                        </div>
                                        <div className="p-4">
                                            <div className="text-sm text-muted-foreground">{item.title}</div>
                                            <div className="text-foreground font-medium">{item.value}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <Card className="text-right bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] border-0 text-egypt-white shadow-elegant">
                            <CardContent className="p-6">
                                <h4 className="text-xl font-bold mb-4">انضم إلى مجتمعنا</h4>
                                <p className="mb-4 text-egypt-white/90">
                                    هل أنت مستعد لتصبح جزءًا من اتحاد شباب مصر؟ سجل اليوم وابدأ في إحداث فرق في مجتمعك.
                                </p>
                                <Button
                                    variant="outline-hero"
                                    className="border-egypt-white text-egypt-white hover:bg-egypt-white hover:text-egypt-red"
                                >
                                    سجل الآن
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        <Card className="bg-card border-border shadow-card">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-right text-foreground mb-6">أرسل لنا رسالة</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">الاسم الأول</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-egypt-gold focus:border-transparent transition-all duration-300"
                                                placeholder="Ahmed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">الاسم الأخير</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-egypt-gold focus:border-transparent transition-all duration-300"
                                                placeholder="Mohamed"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-egypt-gold focus:border-transparent transition-all duration-300"
                                            placeholder="ahmed@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">الموضوع</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-egypt-gold focus:border-transparent transition-all duration-300"
                                            placeholder="مهتم بالانضمام"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">الرسالة</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-egypt-gold focus:border-transparent transition-all duration-300"
                                            placeholder="أخبرنا عن اهتمامك بالانضمام إلى الاتحاد..."
                                        ></textarea>
                                    </div>

                                    <Button variant="cta" size="lg" className="w-full">
                                        <Send className="w-5 h-5 mr-2" />
                                        إرسال الرسالة
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
