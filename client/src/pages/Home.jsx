import { lazy, Suspense } from "react"
import Hero from "@/components/sections/Hero"
import { SimpleInViewSection } from "@/components/ui/SimpleMotionComponents"
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata"
import { getPageSEO } from "@/constants/seoConfig"

// Lazy load below-the-fold sections for better initial page load
const About = lazy(() => import("@/components/sections/About"))
const Features = lazy(() => import("@/components/sections/Features"))
const News = lazy(() => import("@/components/sections/News"))
const Events = lazy(() => import("@/components/sections/Events"))
const Contact = lazy(() => import("@/components/sections/Contact"))

// Lightweight loading placeholder for sections
const SectionSkeleton = () => (
    <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-lg w-full h-96"></div>
    </div>
)

const Home = () => {
    // Set document metadata for SEO
    const seoData = getPageSEO("home", "ar")
    useDocumentMetadata(seoData)

    return (
        <>
            <title>{seoData.title}</title>
            <meta name="description" content={seoData.description} />
            <meta name="keywords" content={seoData.keywords} />
            <meta property="og:title" content={seoData.title} />
            <meta property="og:description" content={seoData.description} />
            <meta property="og:image" content={`${window.location.origin}${seoData.image}`} />
            <meta property="og:url" content={`${window.location.origin}${seoData.url}`} />
            <meta property="og:type" content={seoData.type} />
            <meta property="og:locale" content={seoData.locale} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoData.title} />
            <meta name="twitter:description" content={seoData.description} />
            <link rel="canonical" href={`${window.location.origin}${seoData.url}`} />

            <div className="min-h-screen" dir="rtl">
                {/* Hero section appears immediately without InView */}
                <Hero />

                {/* About section with scroll-triggered animation */}
                <SimpleInViewSection animation="fadeInUp" delay={0.2}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <About />
                    </Suspense>
                </SimpleInViewSection>

                {/* Features section with scale-in animation */}
                <SimpleInViewSection animation="scaleIn" delay={0.1}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <Features />
                    </Suspense>
                </SimpleInViewSection>

                {/* News section with slide-in from left */}
                <SimpleInViewSection animation="fadeInLeft" delay={0.3}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <News />
                    </Suspense>
                </SimpleInViewSection>

                {/* Events section with slide-in from right */}
                <SimpleInViewSection animation="fadeInRight" delay={0.2}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <Events />
                    </Suspense>
                </SimpleInViewSection>

                {/* Contact section with bounce-in animation */}
                <SimpleInViewSection animation="bounceIn" delay={0.4}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <Contact />
                    </Suspense>
                </SimpleInViewSection>
            </div>
        </>
    )
}

export default Home
