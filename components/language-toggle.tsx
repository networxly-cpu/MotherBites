'use client';

import { useLanguage } from '@/lib/language-context';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
          language === 'en'
            ? 'bg-primary text-white shadow-lg shadow-primary/50'
            : 'bg-border text-foreground hover:bg-secondary hover:text-white'
        }`}
      >
        {t('english')}
      </button>
      <button
        onClick={() => setLanguage('mr')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
          language === 'mr'
            ? 'bg-secondary text-white shadow-lg shadow-secondary/50'
            : 'bg-border text-foreground hover:bg-primary hover:text-white'
        }`}
      >
        {t('marathi')}
      </button>
    </div>
  );
}
