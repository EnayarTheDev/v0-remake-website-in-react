'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ApprovalRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  grade: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Book {
  id: string;
  title: string;
  user_id: string;
  owner_email: string;
  is_available: boolean;
  created_at: string;
}

interface AdminDashboardProps {
  userRole: string | null;
  user: any;
}

const OWNER_EMAIL = 'rayane.benchine@gmail.com';

export default function AdminDashboard({ userRole, user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'approvals' | 'books' | 'admins'>('approvals');
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      if (activeTab === 'approvals') {
        const { data } = await supabase
          .from('approval_requests')
          .select('*')
          .order('created_at', { ascending: false });
        setApprovals(data || []);
      } else if (activeTab === 'books') {
        const { data } = await supabase
          .from('books')
          .select('*, profiles(email)')
          .order('created_at', { ascending: false });
        setBooks(data?.map(b => ({ ...b, owner_email: b.profiles?.email })) || []);
      } else if (activeTab === 'admins' && userRole === 'owner') {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, role')
          .in('role', ['admin', 'owner'])
          .order('created_at', { ascending: false });
        setAdmins(data || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, email: string) => {
    const supabase = createClient();
    try {
      await supabase
        .from('approval_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'approved' } : a));
      alert(`Approved! User ${email} can now sign up.`);
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleReject = async (id: string) => {
    const supabase = createClient();
    try {
      await supabase
        .from('approval_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      setApprovals(approvals.filter(a => a.id !== id));
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    const supabase = createClient();
    try {
      await supabase.from('books').delete().eq('id', bookId);
      setBooks(books.filter(b => b.id !== bookId));
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (userRole !== 'owner') {
      alert('Only the owner can promote admins');
      return;
    }

    const supabase = createClient();
    try {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

      await loadData();
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleDemoteAdmin = async (userId: string) => {
    if (userRole !== 'owner') {
      alert('Only the owner can change admin roles');
      return;
    }

    const supabase = createClient();
    try {
      await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', userId);

      await loadData();
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        {user.email === OWNER_EMAIL && (
          <p className="text-green-600 font-semibold">You are the Owner</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'approvals'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Approval Requests ({approvals.length})
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'books'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manage Books ({books.length})
        </button>
        {userRole === 'owner' && (
          <button
            onClick={() => setActiveTab('admins')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'admins'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Admins
          </button>
        )}
      </div>

      {/* Approval Requests Tab */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {approvals.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No pending approvals</p>
            </div>
          ) : (
            approvals.map((req) => (
              <div key={req.id} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{req.first_name} {req.last_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{req.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Grade</p>
                    <p className="font-semibold text-gray-900">{req.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      req.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : req.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(req.id, req.email)}
                      className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          {books.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No books listed</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{book.title}</h3>
                  <p className="text-sm text-gray-600">Owner: {book.owner_email}</p>
                  <p className="text-xs text-gray-500">
                    Listed: {new Date(book.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveBook(book.id)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Admins Tab */}
      {activeTab === 'admins' && userRole === 'owner' && (
        <div className="space-y-4">
          {admins.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No admins yet</p>
            </div>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{admin.email}</p>
                  <p className="text-sm text-gray-600">Role: {admin.role}</p>
                </div>
                {admin.role === 'admin' && (
                  <button
                    onClick={() => handleDemoteAdmin(admin.id)}
                    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Demote to User
                  </button>
                )}
                {admin.role === 'user' && (
                  <button
                    onClick={() => handlePromoteToAdmin(admin.id)}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Make Admin
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
