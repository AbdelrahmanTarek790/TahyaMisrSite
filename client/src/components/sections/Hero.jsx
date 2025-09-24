import { Button } from "@/components/ui/enhanced-button"
import { SimpleInViewStagger } from "@/components/ui/SimpleMotionComponents"
import { Link } from "react-router-dom"
// import heroImage from "@/assets/1758267543110-78fd503d-f9e8-47a2-9933-7db0dab1aa98.png"
import heroImage from "@/assets/hero.jpg"

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-egypt-black/80 via-egypt-black/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <SimpleInViewStagger className="max-w-4xl mx-auto" staggerDelay={0.2}>
                    <h1 className="text-5xl md:text-7xl font-bold text-egypt-white mb-6 leading-tight hero-title">
                        اتحاد شباب{" "}
                        <span className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] bg-clip-text text-transparent animate-gradient">
                            تحيــــــا مصر
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-egypt-white/90 mb-8 max-w-2xl mx-auto leading-relaxed hero-subtitle" dir="rtl">
                        هيئة شبابية تابعة الي وزارة الشباب و الرياضة بموجب قرار وزاري رقم ١١٥٩ لسنة ٢٠٢٥ - صادر بتاريخ ٢ / ٩ / ٢٠٢٥، خاضعة لقانون رقم
                        ٢١٨ لسنة ٢٠١٧ وتعديلاته.
                    </p>

                    <div className="flex gap-4 justify-center items-center hero-buttons">
                        <Link to="/join">
                            <Button variant="hero" size="xl" className="btn-spring animate-pulse-glow">
                                انضم الان
                            </Button>
                        </Link>
                        <Button
                            variant="outline-hero"
                            size="xl"
                            className="btn-spring hover-spring"
                            onClick={() => {
                                document.getElementById("about-section")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                })
                            }}
                        >
                            المزيد
                        </Button>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto hero-stats">
                        <div className="text-center stagger-item">
                            <div className="text-3xl font-bold text-egypt-gold mb-2 animate-float">500+</div>
                            <div className="text-egypt-white/80">الأعضاء النشطون</div>
                        </div>
                        <div className="text-center stagger-item">
                            <div className="text-3xl font-bold text-egypt-gold mb-2 animate-float-gentle">27</div>
                            <div className="text-egypt-white/80">المحافظات</div>
                        </div>
                        <div className="text-center stagger-item">
                            <div className="text-3xl font-bold text-egypt-gold mb-2 animate-float">50+</div>
                            <div className="text-egypt-white/80">الفعاليات هذا العام</div>
                        </div>
                    </div>
                </SimpleInViewStagger>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-in-elastic cursor-pointer"
                style={{ animationDelay: "1.5s" }}
                onClick={() => {
                    document.getElementById("about-section")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }}
            >
                <div className="w-6 h-10 border-2 border-egypt-gold rounded-full flex justify-center hover-spring animate-glow">
                    <div className="w-1 h-3 bg-egypt-gold rounded-full mt-2 animate-float"></div>
                </div>
            </div>
        </section>
    )
}

export default Hero
