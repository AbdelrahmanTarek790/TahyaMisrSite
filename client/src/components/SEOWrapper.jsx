import { useDocumentMetadata } from "../hooks/useDocumentMetadata"
import { getPageSEO } from "../constants/seoConfig"

/**
 * SEO Wrapper component that provides React 19 document metadata for public pages
 * @param {Object} props
 * @param {string} props.pageKey - The page key from seoConfig
 * @param {string} props.locale - Language locale (ar/en)
 * @param {Object} props.dynamicSEO - Dynamic SEO data to override defaults
 * @param {React.ReactNode} props.children - Page content
 */
export const SEOWrapper = ({ pageKey, locale = "ar", dynamicSEO = {}, children }) => {
    // Get SEO configuration
    const seoData = getPageSEO(pageKey, locale, dynamicSEO)

    // Apply metadata using the custom hook
    useDocumentMetadata(seoData)

    return (
        <>
            {/* React 19 built-in document metadata */}
            <title>{seoData.title}</title>
            <meta name="description" content={seoData.description} />
            <meta name="keywords" content={seoData.keywords} />
            <meta name="author" content={seoData.author} />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#1e40af" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={seoData.type} />
            <meta property="og:title" content={seoData.title} />
            <meta property="og:description" content={seoData.description} />
            <meta property="og:image" content={`${window.location.origin}${seoData.image}`} />
            <meta property="og:url" content={`${window.location.origin}${seoData.url}`} />
            <meta property="og:locale" content={seoData.locale} />
            <meta property="og:site_name" content="اتحاد شباب تحيا مصر" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoData.title} />
            <meta name="twitter:description" content={seoData.description} />
            <meta name="twitter:image" content={`${window.location.origin}${seoData.image}`} />

            {/* Canonical URL */}
            <link rel="canonical" href={`${window.location.origin}${seoData.url}`} />

            {/* Alternate language links */}
            {seoData.alternateLanguages?.map((alt) => (
                <link key={alt.locale} rel="alternate" hrefLang={alt.locale} href={`${window.location.origin}${alt.url}`} />
            ))}

            {/* Structured Data (JSON-LD) */}
            {seoData.structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(seoData.structuredData),
                    }}
                />
            )}

            {/* Page content */}
            {children}
        </>
    )
}

export default SEOWrapper
