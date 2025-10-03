/**
 * Quick SEO component for simple public pages
 * This can be used for pages that don't need complex dynamic SEO
 */
import { useDocumentMetadata } from "../hooks/useDocumentMetadata"
import { getPageSEO } from "../constants/seoConfig"

export const QuickSEO = ({ pageKey, locale = "ar", dynamicData = {} }) => {
    const seoData = getPageSEO(pageKey, locale, dynamicData)
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
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="canonical" href={`${window.location.origin}${seoData.url}`} />
        </>
    )
}
