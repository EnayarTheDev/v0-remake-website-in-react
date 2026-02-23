'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface OfferBooksPageProps {
  setCurrentPage: (page: string) => void;
  user: any;
}

export default function OfferBooksPage({ setCurrentPage, user }: OfferBooksPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'math',
    level: 'college',
    condition: 'excellent',
    description: '',
  });

  const subjects = ['Math', 'Physics', 'French', 'English', 'History', 'Geography', 'Chemistry', 'Biology'];
  const levels = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];
  const conditions = ['Excellent', 'Good', 'Fair'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Please enter a book title');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase.from('books').insert([
        {
          user_id: user.id,
          title: formData.title,
          subject: formData.subject,
          level: formData.level,
          condition: formData.condition,
          description: formData.description,
          is_available: true,
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        title: '',
        subject: 'math',
        level: 'college',
        condition: 'excellent',
        description: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Offer Books to Swap</h1>
        <p className="text-gray-600 mb-8">List the books you want to share with other students</p>

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            ✓ Book added successfully! It's now available for swapping.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Book Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="e.g., French Grammar 3rd Year"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              >
                {subjects.map((s) => (
                  <option key={s} value={s.toLowerCase()}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              >
                {levels.map((l) => (
                  <option key={l} value={l.toLowerCase()}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            >
              {conditions.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="e.g., Slightly worn cover, some notes in margins"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Book to Swap'}
          </button>
        </form>
      </div>
    </div>
  );
}
