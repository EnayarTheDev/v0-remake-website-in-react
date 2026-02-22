'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBooks } from '@/context/BooksContext';

interface SellPageProps {
  setCurrentPage: (page: string) => void;
}

export default function SellPage({ setCurrentPage }: SellPageProps) {
  const { t, language } = useLanguage();
  const { addBook } = useBooks();
  const isArabic = language === 'ar';

  const [formData, setFormData] = useState({
    title: '',
    subject: 'math',
    level: 'college',
    condition: 'excellent',
    price: '',
    paymentType: 'cash',
    description: '',
    contact: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.contact) {
      alert('Please fill in all required fields');
      return;
    }

    addBook({
      title: formData.title,
      subject: formData.subject,
      level: formData.level,
      condition: formData.condition,
      price: parseInt(formData.price),
      paymentType: formData.paymentType,
      seller: 'You',
      contact: formData.contact,
      description: formData.description
    });

    setShowSuccess(true);
    setFormData({
      title: '',
      subject: 'math',
      level: 'college',
      condition: 'excellent',
      price: '',
      paymentType: 'cash',
      description: '',
      contact: ''
    });

    setTimeout(() => {
      setShowSuccess(false);
      setCurrentPage('home');
    }, 2000);
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('sell_title')}</h1>

        {showSuccess && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg font-semibold">
            {t('success_message')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_title')} *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
              placeholder="Enter book title"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_subject')} *
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="math">{t('subject_math')}</option>
              <option value="physics">{t('subject_physics')}</option>
              <option value="french">{t('subject_french')}</option>
              <option value="english">{t('subject_english')}</option>
              <option value="history">{t('subject_history')}</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_level')} *
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="college">{t('level_college')}</option>
              <option value="lycee">{t('level_lycee')}</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_condition')} *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="excellent">{t('condition_excellent')}</option>
              <option value="good">{t('condition_good')}</option>
              <option value="fair">{t('condition_fair')}</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_price')} *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
              placeholder="0"
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_payment_type')} *
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="cash">{t('payment_cash')}</option>
              <option value="bc">{t('payment_bc')}</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 resize-none"
              rows={5}
              placeholder="Describe the book condition..."
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form_contact')} *
            </label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
              placeholder="email@example.com or +1234567890"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            {t('btn_publish')}
          </button>
        </form>
      </div>
    </div>
  );
}
