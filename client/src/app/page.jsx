import HomeClient from "./HomeClient"

// Metadata for SEO
export const metadata = {
    title: "اتحاد شباب تحيا مصر - الصفحة الرئيسية | Tahya Misr Youth Union",
    description: "اتحاد شباب تحيا مصر - منظمة شبابية مصرية تهدف إلى تمكين الشباب وتطوير قدراتهم من خلال الفعاليات، ورش العمل، والمبادرات المجتمعية",
    keywords: "اتحاد شباب تحيا مصر, tahya misr, youth union, منظمة شبابية, تمكين الشباب, فعاليات شبابية, مبادرات مجتمعية, egypt youth",
    openGraph: {
        title: "اتحاد شباب تحيا مصر",
        description: "منظمة شبابية مصرية لتمكين الشباب وتطوير قدراتهم",
        url: "https://tahyamisryu.com",
        siteName: "اتحاد شباب تحيا مصر",
        images: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "اتحاد شباب تحيا مصر",
        description: "منظمة شبابية مصرية لتمكين الشباب",
        images: ["https://tahyamisryu.com/Logo.webp"],
    },
    alternates: {
        canonical: "https://tahyamisryu.com",
    },
}

export default function Home() {
    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "اتحاد شباب تحيا مصر",
                        alternateName: "Tahya Misr Youth Union",
                        url: "https://tahyamisryu.com",
                        logo: "https://tahyamisryu.com/Logo.webp",
                        description: "منظمة شبابية مصرية تهدف إلى تمكين الشباب وتطوير قدراتهم",
                        address: {
                            "@type": "PostalAddress",
                            addressCountry: "EG",
                        },
                        sameAs: [
                            "https://www.facebook.com/tahyamisryouthunion",
                            "https://twitter.com/tahyamisryu",
                            "https://www.instagram.com/tahyamisryu",
                        ],
                    }),
                }}
            />
            <HomeClient />
        </>
    )
}
