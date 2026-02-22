'use client';

import { useLanguage } from '@/context/LanguageContext';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-12">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-green-500">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-red-500 bg-clip-text text-transparent text-center mb-4">
          {t('hero_title')}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          {t('hero_subtitle')}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setCurrentPage('browse')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            {t('btn_browse')}
          </button>
          <button
            onClick={() => setCurrentPage('sell')}
            className="px-8 py-3 bg-white text-red-500 border-3 border-red-500 font-semibold rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition-all"
          >
            {t('btn_sell')}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {t('why_title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4 text-center">💰</div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
              {t('feature1_title')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('feature1_desc')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4 text-center">🌍</div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
              {t('feature2_title')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('feature2_desc')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-red-500 hover:shadow-xl hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4 text-center">⚡</div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
              {t('feature3_title')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('feature3_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
