// e:\Programming\Development\ThyaMisr\tahyamisrjsnext\src\app\(public)\news\[id]\BackButton.jsx

'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    
    return (
        <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-4 font-arabic"
        >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة
        </Button>
    );
}