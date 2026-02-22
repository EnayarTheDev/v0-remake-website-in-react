'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooks } from '@/context/BooksContext';
import PurchaseTicket from '@/components/PurchaseTicket';

interface DetailsPageProps {
  bookId: number;
  setCurrentPage: (page: string) => void;
}

function generateTicketCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-';
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function DetailsPage({ bookId, setCurrentPage }: DetailsPageProps) {
  const { t, language } = useLanguage();
  const { getBook, bcBalance, setBcBalance } = useBooks();
  const isArabic = language === 'ar';

  const book = getBook(bookId);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [ticketPaymentType, setTicketPaymentType] = useState('');

  if (!book) {
    return <div className="text-center text-gray-600 py-12">Book not found</div>;
  }

  const handleBuy = (paymentType: string) => {
    if (paymentType === 'bc' && bcBalance < book.price) {
      alert(t('insufficient_bc'));
      return;
    }

    const code = generateTicketCode();
    setTicketCode(code);
    setTicketPaymentType(paymentType);

    if (paymentType === 'bc') {
      setBcBalance(bcBalance - book.price);
    }

    setShowTicket(true);
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

            {/* Price */}
            <div className="text-4xl font-bold text-red-500">
              {book.price} {book.paymentType === 'bc' ? '💰 BC' : '💵 DH'}
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

            {/* Buy Buttons */}
            <div className="space-y-3 pt-4">
              {book.paymentType === 'cash' && (
                <button
                  onClick={() => handleBuy('cash')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  💵 {t('btn_buy_cash')} {book.price} DH
                </button>
              )}
              {book.paymentType === 'bc' && (
                <button
                  onClick={() => handleBuy('bc')}
                  className={`w-full font-bold py-3 rounded-lg transition-all ${
                    bcBalance >= book.price
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-800 hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={bcBalance < book.price}
                >
                  💰 {t('btn_buy_bc')} {book.price} BC
                </button>
              )}
              <button className="w-full border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg hover:bg-red-50 transition-all">
                {t('btn_report')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Ticket Modal */}
      {showTicket && (
        <PurchaseTicket
          book={book}
          ticketCode={ticketCode}
          paymentType={ticketPaymentType}
          onClose={() => {
            setShowTicket(false);
            setCurrentPage('home');
          }}
        />
      )}
    </div>
  );
}
