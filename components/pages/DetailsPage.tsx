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

interface UserBook {
  id: string;
  title: string;
  subject: string;
  condition: string;
}

interface DetailsPageProps {
  bookId: string;
  setCurrentPage: (page: string) => void;
  user: any;
}

export default function DetailsPage({ bookId, setCurrentPage, user }: DetailsPageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async () => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*, profiles(first_name, last_name, email)')
        .eq('id', bookId)
        .single();

      if (error) throw error;

      setBook({
        ...data,
        owner_name: data.profiles ? `${data.profiles.first_name} ${data.profiles.last_name}` : 'Unknown',
        owner_email: data.profiles?.email || '',
      });

      // Load user's books if logged in
      if (user) {
        const { data: userBooksData } = await supabase
          .from('books')
          .select('id, title, subject, condition')
          .eq('user_id', user.id)
          .eq('is_available', true);

        setUserBooks(userBooksData || []);
      }
    } catch (err) {
      console.error('Error loading book:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateSwap = async () => {
    if (!user) {
      alert('Please log in to swap books');
      return;
    }

    if (selectedBooks.length === 0) {
      alert('Please select at least one book to swap');
      return;
    }

    const supabase = createClient();
    const swapCode = Math.random().toString(36).substr(2, 8).toUpperCase();

    try {
      const { error } = await supabase.from('swap_offers').insert([
        {
          book_id: bookId,
          book_owner_id: book?.user_id,
          requester_id: user.id,
          requester_name: user.user_metadata?.first_name || 'User',
          requester_email: user.email,
          requested_book_title: book?.title,
          offered_books: selectedBooks.map(id => 
            userBooks.find(b => b.id === id)?.title || 'Unknown'
          ),
          status: 'pending',
          swap_code: swapCode,
        }
      ]);

      if (error) throw error;

      setSwapSuccess(true);
      setTimeout(() => {
        setSwapSuccess(false);
        setCurrentPage('browse');
      }, 2000);
    } catch (err) {
      alert('Error creating swap request: ' + err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!book) {
    return <div className="text-center text-gray-600 py-12">Book not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentPage('browse')}
        className="mb-6 text-green-600 hover:text-green-700 font-semibold"
      >
        ← Back to Browse
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Book Header */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{book.title}</h1>
          <div className="flex gap-4 text-gray-700">
            <span className="font-semibold">{book.subject}</span>
            <span className="font-semibold">{book.level}</span>
            <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
            </span>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{book.description}</p>
          </div>
        )}

        {/* Seller Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500 mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Offered By</h3>
          <p className="text-gray-700 mb-1">{book.owner_name}</p>
          <p className="text-sm text-gray-600">📧 {book.owner_email}</p>
        </div>

        {/* Free Swap Badge */}
        <div className="text-3xl font-bold text-green-600 mb-6">
          ✨ Free Swap
        </div>

        {/* Swap Section */}
        {user && user.id !== book.user_id ? (
          showSwapForm ? (
            <div className="space-y-3 pt-4 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">Select books you want to swap</h3>
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
                <p className="text-gray-600 text-sm">You haven't offered any books yet.</p>
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
                  🔄 Propose Swap
                </button>
                <button
                  onClick={() => setShowSwapForm(false)}
                  className="px-4 font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (userBooks.length === 0) {
                  setCurrentPage('offer');
                } else {
                  setShowSwapForm(true);
                }
              }}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              {userBooks.length === 0 ? '📚 Offer Books First' : '🔄 Request Swap'}
            </button>
          )
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
            <p className="font-semibold">This is your book</p>
          </div>
        )}

        {!user && (
          <button
            onClick={() => window.location.href = '/auth/request-approval'}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Sign Up to Swap
          </button>
        )}

        {swapSuccess && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg font-semibold mt-4">
            ✓ Swap request sent! Check your notifications for updates.
          </div>
        )}
      </div>
    </div>
  );
}
