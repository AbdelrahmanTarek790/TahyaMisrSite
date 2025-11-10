import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { generateSmartLink } from "@/utils/deepLinkHandler"
import { toast } from "sonner"

const ShareButton = ({ type, id, title }) => {
    const [copied, setCopied] = useState(false)
    const shareUrl = generateSmartLink(type, id)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            toast.success("تم نسخ الرابط")
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            toast.error("فشل في نسخ الرابط")
        }
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: shareUrl,
                })
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error sharing:", error)
                }
            }
        } else {
            handleCopy()
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 ml-2" />
                    مشاركة
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                    <h4 className="font-medium text-sm font-arabic">مشاركة</h4>

                    <div className="flex gap-2">
                        <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted" dir="ltr" />
                        <Button size="sm" onClick={handleCopy} variant="outline">
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>

                    {navigator.share && (
                        <Button onClick={handleNativeShare} className="w-full" variant="outline">
                            <Share2 className="w-4 h-4 ml-2" />
                            مشاركة عبر...
                        </Button>
                    )}

                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground font-arabic">سيفتح الرابط التطبيق تلقائياً على الأجهزة المحمولة</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ShareButton
