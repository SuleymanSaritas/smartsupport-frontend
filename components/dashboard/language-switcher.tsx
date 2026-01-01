"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  // Get the current language display with flag
  const getLanguageDisplay = (lang: "en" | "tr") => {
    return lang === "en" ? "🇬🇧 English" : "🇹🇷 Türkçe";
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white/80" />
      <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "tr")}>
        <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white hover:bg-white/20 focus:ring-white/50 data-[placeholder]:text-white/80 [&>span]:text-white [&>svg]:text-white [&>svg]:opacity-80">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="en" className="text-foreground cursor-pointer">
            🇬🇧 English
          </SelectItem>
          <SelectItem value="tr" className="text-foreground cursor-pointer">
            🇹🇷 Türkçe
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

