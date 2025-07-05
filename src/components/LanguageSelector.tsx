"use client";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { supportedLanguages } from "@/lib/api";
import { Code} from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const LanguageSelector = ({ 
  value,
  onChange,
  label,
  disabled = false
}: LanguageSelectorProps) => {
  const selectId = `language-selector-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Code className="h-4 w-4 text-slate-500" />
        {label}
      </label>
      <div className="relative">
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger 
            id={selectId} 
            className="w-full h-12 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <SelectValue placeholder="Select language" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
            {supportedLanguages.map((language) => (
              <SelectItem 
                key={language.value} 
                value={language.value}
                className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500" />
                  <span className="font-medium">{language.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
      </div>
    </div>
  );
};

export default LanguageSelector;