import { getPageSEO, seoConfig } from "../constants/seoConfig"

/**
 * Enhanced SEO component using React 19's native metadata support
 * Works seamlessly with SSR - no client-side DOM manipulation needed
 */
export const SEOMetadata = ({
    pageKey,
    locale = "ar",
    dynamicData = {},
    title,
    description,
    keywords,
    image,
    url,
    type = "website",
    structuredData,
    baseUrl = seoConfig.site.url,
}) => {
    // If individual props are provided, use them directly
    // Otherwise, use the page configuration
    const seoData = title
        ? {
              title,
              description,
              keywords,
              image: image || "/Logo.png",
              url,
              type,
              locale,
              author: "اتحاد شباب تحيا مصر",
              structuredData,
          }
        : getPageSEO(pageKey, locale, dynamicData)

    // Build absolute URLs for SSR compatibility
    const absoluteImage = seoData.image?.startsWith("http") ? seoData.image : `${baseUrl}${seoData.image}`

    const absoluteUrl = seoData.url?.startsWith("http")
        ? seoData.url
        : `${baseUrl}${seoData.url || ""}`

    return (
        <>
            <title>{seoData.title}</title>
            <meta name="description" content={seoData.description} />
            {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
            <meta name="author" content={seoData.author} />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#1e40af" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={seoData.type} />
            <meta property="og:title" content={seoData.title} />
            <meta property="og:description" content={seoData.description} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:locale" content={seoData.locale} />
            <meta property="og:site_name" content="اتحاد شباب تحيا مصر" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoData.title} />
            <meta name="twitter:description" content={seoData.description} />
            <meta name="twitter:image" content={absoluteImage} />

            {/* Canonical URL */}
            <link rel="canonical" href={absoluteUrl} />

            {/* Structured Data (JSON-LD) */}
            {seoData.structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(seoData.structuredData),
                    }}
                />
            )}
        </>
    )
}
