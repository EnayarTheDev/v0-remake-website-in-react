'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SwapOffer {
  id: string;
  book_id: string;
  requester_id: string;
  requester_name: string;
  requester_email: string;
  requested_book_title: string;
  offered_books: string[];
  status: 'pending' | 'accepted' | 'declined';
  swap_code?: string;
  created_at: string;
}

interface NotificationsPageProps {
  user: any;
}

export default function NotificationsPage({ user }: NotificationsPageProps) {
  const [offers, setOffers] = useState<SwapOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'all'>('pending');

  useEffect(() => {
    const loadOffers = async () => {
      const supabase = createClient();

      try {
        // Get swap offers for books offered by this user
        const { data, error } = await supabase
          .from('swap_offers')
          .select('*')
          .eq('book_owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOffers(data || []);
      } catch (err) {
        console.error('Error loading offers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOffers();
  }, [user.id]);

  const handleAccept = async (offerId: string) => {
    const supabase = createClient();
    
    try {
      // Generate a unique swap code
      const swapCode = Math.random().toString(36).substr(2, 8).toUpperCase();

      const { error } = await supabase
        .from('swap_offers')
        .update({ 
          status: 'accepted',
          swap_code: swapCode
        })
        .eq('id', offerId);

      if (error) throw error;

      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'accepted', swap_code: swapCode } : o));
    } catch (err) {
      alert('Error accepting offer: ' + err);
    }
  };

  const handleDecline = async (offerId: string) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('swap_offers')
        .update({ status: 'declined' })
        .eq('id', offerId);

      if (error) throw error;

      setOffers(offers.filter(o => o.id !== offerId));
    } catch (err) {
      alert('Error declining offer: ' + err);
    }
  };

  const filteredOffers = offers.filter(o => 
    activeTab === 'all' ? true : o.status === activeTab
  );

  if (isLoading) {
    return <div className="text-center py-12">Loading notifications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Swap Offers</h1>
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({offers.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'accepted'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Accepted ({offers.filter(o => o.status === 'accepted').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No offers yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className={`rounded-lg p-6 border-2 ${
                offer.status === 'pending'
                  ? 'bg-blue-50 border-blue-200'
                  : offer.status === 'accepted'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {offer.requester_name} wants to swap
                  </h3>
                  <p className="text-gray-600">
                    Requested: <span className="font-semibold">{offer.requested_book_title}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(offer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  offer.status === 'pending'
                    ? 'bg-blue-200 text-blue-800'
                    : offer.status === 'accepted'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Books offered in exchange:</p>
                <ul className="space-y-1">
                  {offer.offered_books.map((book, idx) => (
                    <li key={idx} className="text-gray-700">
                      • {book}
                    </li>
                  ))}
                </ul>
              </div>

              {offer.status === 'accepted' && offer.swap_code && (
                <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4 rounded">
                  <p className="text-sm text-gray-700 mb-1">Your Swap Code:</p>
                  <p className="text-2xl font-bold text-green-700">{offer.swap_code}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Bring this code and your books to the administration desk
                  </p>
                </div>
              )}

              {offer.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(offer.id)}
                    className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Accept Swap
                  </button>
                  <button
                    onClick={() => handleDecline(offer.id)}
                    className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-600 mt-4">
                Contact: {offer.requester_email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
