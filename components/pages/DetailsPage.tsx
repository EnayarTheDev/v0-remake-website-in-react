'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooks } from '@/context/BooksContext';

interface DetailsPageProps {
  bookId: number;
  setCurrentPage: (page: string) => void;
}

export default function DetailsPage({ bookId, setCurrentPage }: DetailsPageProps) {
  const { t, language } = useLanguage();
  const { getBook, getUserOfferedBooks, addSwapRequest } = useBooks();
  const isArabic = language === 'ar';

  const book = getBook(bookId);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const userBooks = getUserOfferedBooks();

  if (!book) {
    return <div className="text-center text-gray-600 py-12">Book not found</div>;
  }

  const handleInitiateSwap = () => {
    if (selectedBooks.length === 0) {
      alert('Please select at least one book to swap');
      return;
    }

    addSwapRequest({
      bookId: book.id,
      requesterBooks: selectedBooks,
      requesterName: 'You',
      requesterContact: 'your@email.com',
      status: 'pending'
    });

    setSwapSuccess(true);
    setTimeout(() => {
      setSwapSuccess(false);
      setCurrentPage('browse');
    }, 2000);
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <button
        onClick={() => setCurrentPage('browse')}
        className="mb-6 text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2"
      >
        {isArabic ? '← ' : ''}{t('btn_back')}{!isArabic ? ' →' : ''}
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl h-96 text-8xl">
            📖
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">{book.title}</h2>

            <div className="space-y-2 text-lg text-gray-700">
              <p>
                <span className="font-semibold">📚 {t('filter_subject')}:</span> {book.subject}
              </p>
              <p>
                <span className="font-semibold">🎓 {t('filter_level')}:</span> {book.level}
              </p>
              <p>
                <span className="font-semibold">✓ {t('filter_condition')}:</span> {book.condition}
              </p>
            </div>

            {/* Free Swap Badge */}
            <div className="text-3xl font-bold text-green-600">
              ✨ {t('swap_title')} - Free!
            </div>

            {/* Seller Info */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-gray-800 mb-2">{t('seller')}</h3>
              <p className="text-gray-700 mb-1">{book.seller}</p>
              <p className="text-sm text-gray-600">📧 {book.contact}</p>
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">{t('description')}</h3>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}

            {/* Swap Section */}
            {showSwapForm ? (
              <div className="space-y-3 pt-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">{t('swap_desc')}</h3>
                {userBooks.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {userBooks.map(userBook => (
                      <label key={userBook.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(userBook.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBooks([...selectedBooks, userBook.id]);
                            } else {
                              setSelectedBooks(selectedBooks.filter(id => id !== userBook.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{userBook.title}</p>
                          <p className="text-xs text-gray-600">{userBook.subject} - {userBook.condition}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">{t('no_books_offered')}</p>
                )}
                <div className="flex gap-2 pt-3">
                  <button
                    onClick={handleInitiateSwap}
                    disabled={selectedBooks.length === 0}
                    className={`flex-1 font-bold py-2 rounded-lg transition-all ${
                      selectedBooks.length > 0
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    🔄 {t('btn_initiate_swap')}
                  </button>
                  <button
                    onClick={() => setShowSwapForm(false)}
                    className="px-4 font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (userBooks.length === 0) {
                    setCurrentPage('sell');
                  } else {
                    setShowSwapForm(true);
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                {userBooks.length === 0 ? '📚 ' : '🔄 '}{t('btn_request_swap')}
              </button>
            )}

            {swapSuccess && (
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg font-semibold">
                ✓ {t('swap_success')}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
