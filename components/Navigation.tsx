'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useBooks } from '@/context/BooksContext';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const { language, setLanguage, t } = useLanguage();
  const { bcBalance } = useBooks();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isArabic = language === 'ar';

  return (
    <nav
      className="sticky top-0 z-100 bg-white shadow-lg"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              📚 ReBook
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex gap-6 items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-medium transition-all ${
                currentPage === 'home'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-700 hover:text-green-500'
              }`}
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => setCurrentPage('browse')}
              className={`font-medium transition-all ${
                currentPage === 'browse'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-700 hover:text-green-500'
              }`}
            >
              {t('nav_browse')}
            </button>
            <button
              onClick={() => setCurrentPage('sell')}
              className={`font-medium transition-all ${
                currentPage === 'sell'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-700 hover:text-green-500'
              }`}
            >
              {t('nav_sell')}
            </button>
            <button
              onClick={() => setCurrentPage('messages')}
              className={`font-medium transition-all relative ${
                currentPage === 'messages'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-700 hover:text-green-500'
              }`}
            >
              {t('nav_messages')}
            </button>
          </div>

          {/* BC Balance */}
          <div className="flex items-center gap-8">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-2 rounded-full flex items-center gap-2 shadow-md border-4 border-orange-500">
              <span className="text-2xl animate-pulse">💰</span>
              <div className="flex flex-col text-sm">
                <span className="text-xs text-gray-700 font-medium">{t('bc_balance')}</span>
                <span className="font-bold text-gray-900 text-lg">{bcBalance}</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">{t('bc_currency')}</span>
            </div>

            {/* Theme Shop */}
            <button className="text-2xl hover:scale-110 transition-transform">
              🎨
            </button>

            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                👤
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
              {['fr', 'en', 'ar'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as 'fr' | 'en' | 'ar')}
                  className={`px-3 py-1 rounded-full font-semibold text-sm transition-all ${
                    language === lang
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
