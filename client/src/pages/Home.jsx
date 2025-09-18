import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Features from "@/components/sections/Features"
import News from "@/components/sections/News"
import Events from "@/components/sections/Events"
import Contact from "@/components/sections/Contact"
import { SimpleInViewSection } from "@/components/ui/SimpleMotionComponents"
// import Journy from "@/pages/public/Journy"

const Home = () => {
    return (
        <div className="min-h-screen" dir="rtl">
            {/* Hero section appears immediately without InView */}
            <Hero />

            {/* About section with scroll-triggered animation */}
            <SimpleInViewSection animation="fadeInUp" delay={0.2}>
                <About />
            </SimpleInViewSection>

            {/* Features section with scale-in animation */}
            <SimpleInViewSection animation="scaleIn" delay={0.1}>
                <Features />
            </SimpleInViewSection>

            {/* News section with slide-in from left */}
            <SimpleInViewSection animation="fadeInLeft" delay={0.3}>
                <News />
            </SimpleInViewSection>

            {/* Events section with slide-in from right */}
            <SimpleInViewSection animation="fadeInRight" delay={0.2}>
                <Events />
            </SimpleInViewSection>

            {/* Contact section with bounce-in animation */}
            <SimpleInViewSection animation="bounceIn" delay={0.4}>
                <Contact />
            </SimpleInViewSection>
        </div>
    )
}

export default Home
