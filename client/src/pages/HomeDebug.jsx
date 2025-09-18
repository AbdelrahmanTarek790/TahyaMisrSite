import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Features from "@/components/sections/Features"
import News from "@/components/sections/News"
import Events from "@/components/sections/Events"
import Contact from "@/components/sections/Contact"

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* All sections without animations for debugging */}
            <Hero />
            <About />
            <Features />
            <News />
            <Events />
            <Contact />
        </div>
    )
}

export default Home
