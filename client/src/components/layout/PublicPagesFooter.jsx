import React from "react"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
export default function PublicPagesFooter() {
    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Youtube, href: "#", label: "Youtube" },
    ]

    const footerLinks = {
        "Quick Links": [
            { name: "About Us", href: "#about" },
            { name: "Events", href: "#events" },
            { name: "News", href: "#news" },
            { name: "Contact", href: "#contact" },
        ],
        "Get Involved": [
            { name: "Join as Member", href: "#join" },
            { name: "Volunteer", href: "#volunteer" },
            { name: "Leadership Positions", href: "#positions" },
            { name: "Local Chapters", href: "#chapters" },
        ],
        Support: [
            { name: "Help Center", href: "#help" },
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms of Service", href: "#terms" },
            { name: "FAQs", href: "#faq" },
        ],
    }

    return (
        <footer className="bg-egypt-black text-egypt-white">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-12 h-12 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-lg flex items-center justify-center">
                                <span className="text-egypt-white font-bold text-xl">LE</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold">Long Live Egypt</span>
                                <div className="text-sm text-egypt-white/70">Youth Union</div>
                            </div>
                        </div>
                        <p className="text-egypt-white/80 mb-6 leading-relaxed">
                            Empowering Egyptian youth through civic engagement, education, and community action to build a stronger, more united
                            Egypt.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-egypt-white/10 rounded-lg flex items-center justify-center hover:bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] transition-all duration-300 hover:scale-110"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-lg font-semibold mb-6 text-egypt-gold">{title}</h3>
                            <ul className="space-y-3">
                                {links.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-egypt-white/80 hover:text-egypt-gold transition-colors duration-300">
                                            {link.name}
                                        </a>
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
                            <div>
                                <div className="text-sm text-egypt-white/70">Email</div>
                                <div className="text-egypt-white">info@longliveegypt.org</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 text-egypt-white" />
                            </div>
                            <div>
                                <div className="text-sm text-egypt-white/70">Phone</div>
                                <div className="text-egypt-white">+20 123 456 7890</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-egypt-white" />
                            </div>
                            <div>
                                <div className="text-sm text-egypt-white/70">Location</div>
                                <div className="text-egypt-white">Cairo, Egypt</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-egypt-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-egypt-white/70 text-sm mb-4 md:mb-0">© 2024 Long Live Egypt Youth Union. All rights reserved.</div>
                    <div className="text-egypt-white/70 text-sm">Built with ❤️ for Egyptian Youth</div>
                </div>
            </div>
        </footer>
    )
}
