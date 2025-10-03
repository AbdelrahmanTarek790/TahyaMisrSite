import { useDocumentMetadata } from "../hooks/useDocumentMetadata"
import { getPageSEO } from "../constants/seoConfig"

/**
 * Enhanced SEO component that handles both static and dynamic SEO metadata
 * This component properly manages React 19's built-in document metadata
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
}) => {
    // If individual props are provided, use them directly
    // Otherwise, use the page configuration
    const seoData = title
        ? {
              title,
              description,
              keywords,
              image: image || "/Logo.webp",
              url,
              type,
              locale,
              author: "اتحاد شباب تحيا مصر",
              structuredData,
          }
        : getPageSEO(pageKey, locale, dynamicData)

    // Apply metadata using the custom hook
    useDocumentMetadata(seoData)

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
            <meta property="og:image" content={`${window.location.origin}${seoData.image}`} />
            <meta property="og:url" content={`${window.location.origin}${seoData.url || window.location.pathname}`} />
            <meta property="og:locale" content={seoData.locale} />
            <meta property="og:site_name" content="اتحاد شباب تحيا مصر" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoData.title} />
            <meta name="twitter:description" content={seoData.description} />
            <meta name="twitter:image" content={`${window.location.origin}${seoData.image}`} />

            {/* Canonical URL */}
            <link rel="canonical" href={`${window.location.origin}${seoData.url || window.location.pathname}`} />

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
