import React from "react"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import Logo from "@/assets/Logo.png"
export default function PublicPagesFooter() {
    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Youtube, href: "#", label: "Youtube" },
    ]

    const footerLinks = {
        "روابط سريعة": [
            { name: "من نحن", href: "/about" },
            { name: "الأحداث", href: "/events" },
            { name: "الأخبار", href: "/news" },
            { name: "اتصل بنا", href: "/contact" },
        ],
        "انضم إلينا": [
            { name: "انضم كعضو", href: "#join" },
            { name: "تطوع معنا", href: "#volunteer" },
            { name: "المناصب القيادية", href: "#positions" },
            // { name: "الفروع المحلية", href: "#chapters" },
        ],
        الدعم: [
            { name: "مركز المساعدة", href: "/help" },
            { name: "سياسة الخصوصية", href: "/privacy" },
            { name: "شروط الخدمة", href: "/terms" },
            { name: "الأسئلة الشائعة", href: "/faq" },
        ],
    }

    return (
        <footer className="bg-egypt-black text-egypt-white">
            <div className="container mx-auto px-6 py-16">
                <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex  items-center space-x-2 mb-6">
                            <div className="w-16 h-16    bg-white rounded-lg flex items-center justify-center">
                                <img src={Logo} alt="Logo" className="w-12 h-12" />
                            </div>
                            <div className="text-right pr-2" >
                                <span className="text-xl font-bold font-arabic">اتحاد شباب تحيا مصر</span>
                                <div className="text-sm text-egypt-white/70 font-arabic">منظمة شبابية</div>
                            </div>
                        </div>
                        <p className="text-egypt-white/80 mb-6 leading-relaxed font-arabic text-right">
                            تمكين الشباب المصري من خلال المشاركة المدنية والتعليم والعمل المجتمعي لبناء مصر أقوى وأكثر توحداً.
                        </p>
                        <div className="flex  gap-4 ">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    to={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-egypt-white/10 rounded-lg flex items-center justify-center hover:bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] transition-all duration-300 hover:scale-110"
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-lg font-semibold mb-6 text-egypt-gold font-arabic text-right">{title}</h3>
                            <ul className="space-y-3">
                                {links.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.href}
                                            className="text-egypt-white/80 hover:text-egypt-gold transition-colors duration-300 font-arabic text-right block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Bar */}
                <div className="border-t border-egypt-white/20 mt-12 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-egypt-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-egypt-white/70 font-arabic">البريد الإلكتروني</div>
                                <div className="text-egypt-white">info@tahyamisr.org</div>
                            </div>
                        </div>
                        <div className="flex  items-center space-x-3 ">
                            <div className="w-10 h-10 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 text-egypt-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-egypt-white/70 font-arabic">الهاتف</div>
                                <div className="text-egypt-white">+20 123 456 7890</div>
                            </div>
                        </div>
                        <div className="flex  items-center space-x-3 ">
                            <div className="w-10 h-10 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-egypt-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-egypt-white/70 font-arabic">الموقع</div>
                                <div className="text-egypt-white font-arabic">القاهرة، مصر</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-egypt-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-egypt-white/70 text-sm mb-4 md:mb-0 font-arabic">© 2024 اتحاد شباب تحيا مصر. جميع الحقوق محفوظة.</div>
                    <div className="text-egypt-white/70 text-sm font-arabic">صُنع بـ ❤️ للشباب المصري</div>
                </div>
            </div>
        </footer>
    )
}
