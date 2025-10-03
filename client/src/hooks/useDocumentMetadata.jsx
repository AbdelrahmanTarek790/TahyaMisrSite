import { useEffect } from "react"

/**
 * Custom hook for managing document metadata using React 19's built-in capabilities
 * @param {Object} options - Metadata options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.keywords - Meta keywords
 * @param {string} options.author - Author
 * @param {string} options.image - Open Graph image URL
 * @param {string} options.url - Canonical URL
 * @param {string} options.type - Open Graph type (website, article, etc.)
 * @param {string} options.locale - Page locale (ar, en)
 * @param {Array} options.alternateLanguages - Array of alternate language objects
 * @param {Object} options.structuredData - JSON-LD structured data
 */
export const useDocumentMetadata = ({
    title,
    description,
    keywords,
    author = "اتحاد شباب تحيا مصر",
    image = "/Logo.webp",
    url,
    type = "website",
    locale = "ar",
    alternateLanguages = [],
    structuredData,
}) => {
    useEffect(() => {
        // Set document title
        if (title) {
            document.title = title
        }

        // Create or update meta tags
        const updateMetaTag = (property, content, isProperty = false) => {
            if (!content) return

            const attribute = isProperty ? "property" : "name"
            let meta = document.querySelector(`meta[${attribute}="${property}"]`)

            if (!meta) {
                meta = document.createElement("meta")
                meta.setAttribute(attribute, property)
                document.head.appendChild(meta)
            }
            meta.setAttribute("content", content)
        }

        // Basic meta tags
        updateMetaTag("description", description)
        updateMetaTag("keywords", keywords)
        updateMetaTag("author", author)

        // Open Graph tags
        updateMetaTag("og:title", title, true)
        updateMetaTag("og:description", description, true)
        updateMetaTag("og:image", image ? `https://tahyamisryu.com${image}` : null, true)
        updateMetaTag("og:url", url ? `https://tahyamisryu.com${url}` : window.location.href, true)
        updateMetaTag("og:type", type, true)
        updateMetaTag("og:locale", locale, true)
        updateMetaTag("og:site_name", "اتحاد شباب تحيا مصر", true)

        // Twitter Card tags
        updateMetaTag("twitter:card", "summary_large_image")
        updateMetaTag("twitter:title", title)
        updateMetaTag("twitter:description", description)
        updateMetaTag("twitter:image", image ? `${window.location.origin}${image}` : null)

        // Additional SEO tags
        updateMetaTag("robots", "index, follow")
        updateMetaTag("googlebot", "index, follow")
        updateMetaTag("theme-color", "#1e40af")

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]')
        if (!canonical) {
            canonical = document.createElement("link")
            canonical.setAttribute("rel", "canonical")
            document.head.appendChild(canonical)
        }
        canonical.setAttribute("href", url ? `https://tahyamisryu.com${url}` : window.location.href)

        // Alternate language links
        alternateLanguages.forEach(({ locale: altLocale, url: altUrl }) => {
            let alternate = document.querySelector(`link[rel="alternate"][hreflang="${altLocale}"]`)
            if (!alternate) {
                alternate = document.createElement("link")
                alternate.setAttribute("rel", "alternate")
                alternate.setAttribute("hreflang", altLocale)
                document.head.appendChild(alternate)
            }
            alternate.setAttribute("href", `https://tahyamisryu.com${altUrl}`)
        })

        // JSON-LD structured data
        if (structuredData) {
            let script = document.querySelector('script[type="application/ld+json"]')
            if (!script) {
                script = document.createElement("script")
                script.setAttribute("type", "application/ld+json")
                document.head.appendChild(script)
            }
            script.textContent = JSON.stringify(structuredData)
        }

        // Set HTML lang attribute
        document.documentElement.setAttribute("lang", locale)
        document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr")
    }, [title, description, keywords, author, image, url, type, locale, alternateLanguages, structuredData])
}

/**
 * React 19 Document component for setting metadata
 */
export const DocumentHead = ({
    title,
    description,
    keywords,
    author = "اتحاد شباب تحيا مصر",
    image = "https://tahyamisryu.com/Logo.webp",
    url,
    type = "website",
    locale = "ar",
}) => {
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image ? `${image}` : `https://tahyamisryu.com/Logo.webp`} />
            <meta property="og:url" content={url ? `https://tahyamisryu.com${url}` : window.location.href} />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content={locale} />
            <meta property="og:site_name" content="اتحاد شباب تحيا مصر" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image ? `${image}` : `https://tahyamisryu.com/Logo.webp`} />
            <link rel="canonical" href={url ? `https://tahyamisryu.com${url}` : window.location.href} />
        </>
    )
}
