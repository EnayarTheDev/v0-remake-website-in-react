'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/pages/HomePage';
import BrowsePage from '@/components/pages/BrowsePage';
import SellPage from '@/components/pages/SellPage';
import MessagesPage from '@/components/pages/MessagesPage';
import DetailsPage from '@/components/pages/DetailsPage';
import { LanguageProvider } from '@/context/LanguageContext';
import { BooksProvider } from '@/context/BooksContext';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const handleSelectBook = (bookId: number) => {
    setSelectedBookId(bookId);
    setCurrentPage('details');
  };

  return (
    <LanguageProvider>
      <BooksProvider>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="container mx-auto px-4 py-12">
          {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
          {currentPage === 'browse' && <BrowsePage onSelectBook={handleSelectBook} />}
          {currentPage === 'sell' && <SellPage setCurrentPage={setCurrentPage} />}
          {currentPage === 'messages' && <MessagesPage />}
          {currentPage === 'details' && selectedBookId !== null && (
            <DetailsPage bookId={selectedBookId} setCurrentPage={setCurrentPage} />
          )}
        </main>
      </BooksProvider>
    </LanguageProvider>
  );
}
