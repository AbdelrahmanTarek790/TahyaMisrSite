import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-egypt-red mb-4 font-arabic">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">لم يتم العثور على الفعالية</h2>
                <p className="text-gray-600 mb-6 font-arabic">لا يمكن العثور على الفعالية المطلوبة.</p>
                <Link href="/events">
                    <Button className="font-arabic">
                        <ArrowLeft className="ml-2 h-4 w-4" />
                        العودة للفعاليات
                    </Button>
                </Link>
            </div>
        </div>
    )
}
