"use client"
import { lazy, Suspense } from "react"
import Hero from "@/components/sections/Hero"
import { SimpleInViewSection } from "@/components/ui/SimpleMotionComponents"
import PublicLayout from "@/components/layout/PublicPagesLayout"

// Lazy load below-the-fold sections for better initial page load
const About = lazy(() => import("@/components/sections/About"))
const Features = lazy(() => import("@/components/sections/Features"))
const News = lazy(() => import("@/components/sections/News"))
const Events = lazy(() => import("@/components/sections/Events"))
const JobsSection = lazy(() => import("@/components/sections/JobsSection"))
const Contact = lazy(() => import("@/components/sections/Contact"))
const HonorRoll = lazy(() => import("@/components/sections/HonorRoll"))
const Partners = lazy(() => import("@/components/sections/Partners"))
const Privileges = lazy(() => import("@/components/sections/Privileges"))

// Lightweight loading placeholder for sections
const SectionSkeleton = () => (
    <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-lg w-full h-96"></div>
    </div>
)

export default function HomeClient() {
    return (
        <PublicLayout>
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

                {/* Jobs and Internships section - New */}
                <SimpleInViewSection animation="fadeInUp" delay={0.3}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <JobsSection />
                    </Suspense>
                </SimpleInViewSection>

                {/* Honor Roll section - New */}
                <SimpleInViewSection animation="fadeInUp" delay={0.1}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <HonorRoll />
                    </Suspense>
                </SimpleInViewSection>

                {/* Privileges section - New */}
                <SimpleInViewSection animation="fadeInLeft" delay={0.2}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <Privileges />
                    </Suspense>
                </SimpleInViewSection>

                {/* Partners section - New */}
                <SimpleInViewSection animation="fadeInUp" delay={0.1}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <Partners />
                    </Suspense>
                </SimpleInViewSection>

                {/* Contact section with bounce-in animation */}
                <SimpleInViewSection animation="bounceIn" delay={0.4}>
                    <Suspense fallback={<SectionSkeleton />}>
                        <Contact />
                    </Suspense>
                </SimpleInViewSection>
            </div>
        </PublicLayout>
    )
}
