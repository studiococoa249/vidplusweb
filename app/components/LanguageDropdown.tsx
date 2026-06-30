"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";

export default function LanguageDropdown({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "id", label: "Indonesia" },
    { code: "en", label: "English" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setIsOpen(false);
    if (langCode === currentLang) return;
    
    // Pathname might look like "/id/something" or "/en/something"
    // We split and replace the first segment that matches the current language
    const segments = pathname.split('/');
    if (segments.length > 1 && segments[1] === currentLang) {
      segments[1] = langCode;
      router.push(segments.join('/'));
    } else {
      // Fallback if structure is different
      router.push(`/${langCode}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-[#ffbd59] transition p-2 rounded-lg hover:bg-gray-800/50"
        aria-label="Select language"
      >
        <Globe size={18} />
        <span className="text-sm font-medium uppercase hidden sm:inline-block">{currentLang}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-[#121622] border border-gray-700 rounded-xl shadow-lg overflow-hidden z-50 transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="flex flex-col py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-800 ${
                  currentLang === lang.code ? "text-[#ffbd59] font-medium bg-gray-800/30" : "text-gray-300"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
