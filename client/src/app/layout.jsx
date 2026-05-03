import "./globals.css"
import { AuthProvider } from "../context/AuthContext"
import { ErrorProvider } from "../context/ErrorContext"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { LocalizationProvider } from "@/hooks/useLocalization.jsx"
import { Cairo } from "next/font/google"
import Script from "next/script"
const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-cairo",
})
export const metadata = {
    title: "تحيا مصر - Tahya Misr",
    description: "منصة تحيا مصر للشباب - Tahya Misr Youth Platform",
    keywords: "تحيا مصر, مصر, شباب, Tahya Misr, Egypt, Youth",
    authors: [{ name: "Tahya Misr Team" }],
    openGraph: {
        type: "website",
        locale: "ar_EG",
        url: "https://tahyamisryu.com",
        siteName: "تحيا مصر",
        title: "تحيا مصر - Tahya Misr",
        description: "منصة تحيا مصر للشباب",
    },
    twitter: {
        card: "summary_large_image",
        title: "تحيا مصر - Tahya Misr",
        description: "منصة تحيا مصر للشباب",
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" dir="rtl" className={`${cairo.variable} font-Cairo`}>
            <head>
                {/* Microsoft Clarity */}
                <Script
                    id="clarity-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
                        `,
                    }}
                />
            </head>

            <body>
                <LocalizationProvider>
                    <ErrorProvider>
                        <ErrorDisplay />
                        <AuthProvider>{children}</AuthProvider>
                    </ErrorProvider>
                </LocalizationProvider>
            </body>
        </html>
    )
}
