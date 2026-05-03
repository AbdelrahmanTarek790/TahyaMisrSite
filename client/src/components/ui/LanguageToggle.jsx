import { Globe } from "lucide-react"
import { useLocalization } from "../../hooks/useLocalization"
import { Button } from "../ui/button"

const LanguageToggle = () => {
    const { language, changeLanguage } = useLocalization()

    const handleLanguageChange = () => {
        changeLanguage(language === "ar" ? "en" : "ar")
    }

    return (
        <Button variant="outline" size="sm" onClick={handleLanguageChange} className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {language === "ar" ? "English" : "العربية"}
        </Button>
    )
}

export default LanguageToggle
