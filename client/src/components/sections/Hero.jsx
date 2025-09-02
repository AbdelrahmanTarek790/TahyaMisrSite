import { Button } from "@/components/ui/enhanced-button"
import heroImage from "@/assets/hero-image.jpg"

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-egypt-black/80 via-egypt-black/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold text-egypt-white mb-6 leading-tight animate-slide-up">
                        اتحاد شباب{" "}
                        <span className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] bg-clip-text text-transparent animate-float">
                            تحيــــــا مصر
                        </span>
                    </h1>

                    <p
                        className="text-xl md:text-2xl text-egypt-white/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up"
                        style={{ animationDelay: "0.3s" }}
                    >
                        هيئة شبابية تابعه لوزارة الشباب والرياضة، تجمع بين مختلف التوجهات الشبابية تحت مظلة واحدة وتسعى إلى حل قضايا وتحديات حيوية
                        تواجه المجتمع المصري، خاصة الشباب، اعتمادًا على رؤية شبابية متجددة لتعزيز تنمية الوطن والتقدم به نحو آفاق أفضل.
                    </p>

                    <div className="flex  gap-4 justify-center items-center animate-bounce-in" style={{ animationDelay: "0.6s" }}>
                        <Button variant="hero" size="xl" className="animate-pulse-glow hover:scale-110 transition-all duration-300">
                            انضم الان
                        </Button>
                        <Button variant="outline-hero" size="xl" className="hover:scale-105 transition-all duration-300">
                            المزيد
                        </Button>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center animate-scale-in" style={{ animationDelay: "0.9s" }}>
                            <div className="text-3xl font-bold text-egypt-gold mb-2 animate-float">500+</div>
                            <div className="text-egypt-white/80">الأعضاء النشطون</div>
                        </div>
                        <div className="text-center animate-scale-in" style={{ animationDelay: "1.1s" }}>
                            <div className="text-3xl font-bold text-egypt-gold mb-2 animate-float" style={{ animationDelay: "0.5s" }}>
                                27
                            </div>
                            <div className="text-egypt-white/80">المحافظات</div>
                        </div>
                        <div className="text-center animate-scale-in" style={{ animationDelay: "1.3s" }}>
                            <div className="text-3xl font-bold text-egypt-gold mb-2 animate-float" style={{ animationDelay: "1s" }}>
                                50+
                            </div>
                            <div className="text-egypt-white/80">الفعاليات هذا العام</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-egypt-gold rounded-full flex justify-center hover:shadow-glow transition-all duration-300">
                    <div className="w-1 h-3 bg-egypt-gold rounded-full mt-2 animate-float"></div>
                </div>
            </div>
        </section>
    )
}

export default Hero
