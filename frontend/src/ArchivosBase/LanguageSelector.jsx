import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 bg-base-200 p-1 rounded-xl border border-base-300">
      <button
        onClick={() => changeLanguage('es')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
          i18n.language === 'es' 
          ? 'bg-base-100 shadow-sm text-primary font-bold' 
          : 'opacity-50 hover:opacity-100'
        }`}
      >
        <span className="text-lg">🇪🇸</span>
        <span className="text-xs uppercase">ES</span>
      </button>

      <button
        onClick={() => changeLanguage('en')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
          i18n.language === 'en' 
          ? 'bg-base-100 shadow-sm text-primary font-bold' 
          : 'opacity-50 hover:opacity-100'
        }`}
      >
        <span className="text-lg">🇬🇧</span>
        <span className="text-xs uppercase">EN</span>
      </button>
    </div>
  );
};