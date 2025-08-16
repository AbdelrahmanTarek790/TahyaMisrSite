import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Features from "@/components/sections/Features"
import News from "@/components/sections/News"
import Events from "@/components/sections/Events"
import Contact from "@/components/sections/Contact"
import Journy from "@/components/sections/Journy"

const Home = () => {
    return (
        <div className="min-h-screen">
            <section id="home">
                <Hero />
            </section>
            <section id="about">
                <About />
            </section>
            <section id="journey">
                <Journy />
            </section>
            <section id="features">
                <Features />
            </section>
            <section id="news">
                <News />
            </section>
            <section id="events">
                <Events />
            </section>
            <Contact />
        </div>
    )
}

export default Home
