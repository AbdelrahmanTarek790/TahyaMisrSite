// e:\Programming\Development\ThyaMisr\tahyamisrjsnext\src\app\(public)\news\[id]\ShareButtons.jsx

'use client';

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title }) {
    const [copied, setCopied] = useState(false);
    
    const shareOnSocial = (platform) => {
        if (typeof window === 'undefined') return;
        
        const url = window.location.href;
        let shareUrl = "";
        
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
    };
    
    const copyToClipboard = async () => {
        if (typeof window === 'undefined') return;
        
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    return (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 ml-2 font-arabic">شارك:</span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("facebook")}
                className="text-blue-600 hover:bg-blue-50"
            >
                <Facebook className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("twitter")}
                className="text-blue-400 hover:bg-blue-50"
            >
                <Twitter className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("linkedin")}
                className="text-blue-700 hover:bg-blue-50"
            >
                <Linkedin className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="text-gray-600 hover:bg-gray-50"
            >
                <Share2 className="h-4 w-4" />
                {copied && <span className="mr-1 text-xs">تم النسخ!</span>}
            </Button>
        </div>
    );
}