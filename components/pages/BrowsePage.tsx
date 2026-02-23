'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooks } from '@/context/BooksContext';

interface BrowsePageProps {
  onSelectBook: (bookId: number) => void;
}

export default function BrowsePage({ onSelectBook }: BrowsePageProps) {
  const { t, language } = useLanguage();
  const { books } = useBooks();
  const isArabic = language === 'ar';

  const [filters, setFilters] = useState({
    subject: '',
    level: '',
    condition: ''
  });

  const filteredBooks = books.filter(book => {
    if (filters.subject && book.subject !== filters.subject) return false;
    if (filters.level && book.level !== filters.level) return false;
    if (filters.condition && book.condition !== filters.condition) return false;
    return !book.sold;
  });

  const conditionBadgeColors: Record<string, string> = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-amber-400'
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">{t('browse_title')}</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('filter_subject')}
            </label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">{t('filter_all')}</option>
              <option value="math">{t('subject_math')}</option>
              <option value="physics">{t('subject_physics')}</option>
              <option value="french">{t('subject_french')}</option>
              <option value="english">{t('subject_english')}</option>
              <option value="history">{t('subject_history')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('filter_level')}
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">{t('filter_all')}</option>
              <option value="college">{t('level_college')}</option>
              <option value="lycee">{t('level_lycee')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('filter_condition')}
            </label>
            <select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">{t('filter_all')}</option>
              <option value="excellent">{t('condition_excellent')}</option>
              <option value="good">{t('condition_good')}</option>
              <option value="fair">{t('condition_fair')}</option>
            </select>
          </div>


        </div>
      </div>

      {/* Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book.id)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-green-500 hover:-translate-y-2 transition-all border-3 border-transparent cursor-pointer"
            >
              {/* Image */}
              <div className="w-full h-48 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-5xl text-white">
                📖
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {book.title}
                </h3>

                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  <p>📚 {book.subject}</p>
                  <p>🎓 {book.level}</p>
                </div>

                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white font-semibold text-xs ${
                      conditionBadgeColors[book.condition] || 'bg-gray-500'
                    }`}
                  >
                    {book.condition}
                  </span>
                </div>

                <div className="text-lg font-semibold text-green-600 mb-2">
                  ✨ Free Swap
                </div>

                <p className="text-xs text-gray-500">👤 {book.seller}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-2xl text-gray-400">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
}
