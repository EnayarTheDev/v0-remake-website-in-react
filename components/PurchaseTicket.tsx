'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Book } from '@/context/BooksContext';

interface PurchaseTicketProps {
  book: Book;
  ticketCode: string;
  paymentType: string;
  onClose: () => void;
}

export default function PurchaseTicket({
  book,
  ticketCode,
  paymentType,
  onClose
}: PurchaseTicketProps) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const currentDate = new Date().toLocaleDateString(
    language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-MA' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const paymentText =
    paymentType === 'bc'
      ? `${book.price} ${t('bc_currency')}`
      : `${book.price} ${t('dh')}`;

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Ticket */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Perforations Top */}
        <div className="h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 text-center">
          <div className="text-4xl font-bold mb-2">📚 ReBook</div>
          <div className="text-xl font-semibold uppercase tracking-wider">
            {t('ticket_title')}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Book Info */}
          <div className="flex justify-between items-start pb-3 border-b-2 border-dashed border-gray-300">
            <span className="font-semibold text-gray-700">{t('ticket_book')}:</span>
            <span className="text-right max-w-xs">{book.title}</span>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-gray-300">
            <span className="font-semibold text-gray-700">{t('ticket_price')}:</span>
            <span className="text-2xl font-bold text-red-500">{paymentText}</span>
          </div>

          {/* Payment Type */}
          <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-gray-300">
            <span className="font-semibold text-gray-700">{t('ticket_payment')}:</span>
            <span className="font-semibold">
              {paymentType === 'bc' ? t('payment_type_bc') : t('payment_type_cash')}
            </span>
          </div>

          {/* Seller */}
          <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-gray-300">
            <span className="font-semibold text-gray-700">{t('ticket_seller')}:</span>
            <span className="font-semibold">{book.seller}</span>
          </div>

          {/* Divider */}
          <div className="h-0.5 bg-gradient-to-r from-green-500 to-blue-500 my-4" />

          {/* Code Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">
              {t('ticket_code')}
            </p>
            <p className="text-3xl font-mono font-bold text-green-600 tracking-widest">
              {ticketCode}
            </p>

            {/* Barcode */}
            <div className="flex justify-center gap-1 h-16 mt-3 items-center">
              {[2, 5, 3, 6, 2, 4, 3, 5].map((height, i) => (
                <div
                  key={i}
                  className="bg-gray-800 opacity-0 animate-pulse"
                  style={{
                    width: '3px',
                    height: `${height * 3}px`,
                    animationDelay: `${0.4 + i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Date */}
          <p className="text-center text-xs text-gray-500 mt-3">{currentDate}</p>

          {/* Footer */}
          <div className="bg-gray-100 p-3 rounded text-center text-xs text-gray-600 italic">
            {t('ticket_footer')}
          </div>
        </div>

        {/* Perforations Bottom */}
        <div className="h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 hover:shadow-lg transition-all"
        >
          {t('ticket_close')}
        </button>
      </div>
    </div>
  );
}
