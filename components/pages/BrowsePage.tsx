'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Book {
  id: string;
  title: string;
  subject: string;
  level: string;
  condition: string;
  description: string;
  user_id: string;
  owner_name: string;
  owner_email: string;
  is_available: boolean;
}

interface BrowsePageProps {
  onSelectBook: (bookId: string) => void;
  user: any;
}

export default function BrowsePage({ onSelectBook, user }: BrowsePageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    subject: '',
    level: '',
    condition: '',
  });

  const subjects = ['math', 'physics', 'french', 'english', 'history', 'geography', 'chemistry', 'biology'];
  const levels = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'terminale'];
  const conditions = ['excellent', 'good', 'fair'];

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      let query = supabase
        .from('books')
        .select('*, profiles(first_name, last_name, email)')
        .eq('is_available', true);

      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.log("[v0] Database not ready, showing demo mode");
        setBooks([]);
        setIsLoading(false);
        return;
      }

      const formattedBooks = data?.map(b => ({
        ...b,
        owner_name: b.profiles ? `${b.profiles.first_name} ${b.profiles.last_name}` : 'Unknown',
        owner_email: b.profiles?.email || '',
      })) || [];

      setBooks(formattedBooks);
    } catch (err) {
      console.log("[v0] Demo mode - database unavailable");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    // Don't show own books
    if (user && book.user_id === user.id) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Available Books</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="">All Levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Condition
            </label>
            <select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="">All Conditions</option>
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading books...</div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No books found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-green-500"
            >
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 h-40 flex flex-col justify-between">
                <h3 className="font-bold text-gray-900 line-clamp-2 text-lg">{book.title}</h3>
                <div className="text-sm text-gray-700">
                  <p>{book.subject} • {book.level}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  Offered by: <span className="font-semibold">{book.owner_name}</span>
                </p>

                {book.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{book.description}</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold text-green-600">Free Swap</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
