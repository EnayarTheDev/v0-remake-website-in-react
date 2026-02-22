'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  userName: string;
  bookTitle: string;
  avatar: string;
  messages: Message[];
}

export default function MessagesPage() {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      userName: 'Ahmed M.',
      bookTitle: 'Mathématiques 1ère',
      avatar: '👤',
      messages: [
        {
          id: 1,
          sender: 'Ahmed',
          content: 'Is this book still available?',
          timestamp: new Date(Date.now() - 3600000),
          isOwn: false
        },
        {
          id: 2,
          sender: 'You',
          content: 'Yes, it is available',
          timestamp: new Date(Date.now() - 1800000),
          isOwn: true
        }
      ]
    },
    {
      id: 2,
      userName: 'Sara L.',
      bookTitle: 'Physique-Chimie 3ème',
      avatar: '👤',
      messages: [
        {
          id: 1,
          sender: 'Sara',
          content: 'When can we meet?',
          timestamp: new Date(Date.now() - 7200000),
          isOwn: false
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (conversationId: number) => {
    if (!inputMessage.trim()) return;

    setConversations(
      conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: Math.max(...conv.messages.map(m => m.id), 0) + 1,
                sender: 'You',
                content: inputMessage,
                timestamp: new Date(),
                isOwn: true
              }
            ]
          };
        }
        return conv;
      })
    );
    setInputMessage('');
  };

  const currentConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('messages_title')}</h1>

      <div className="grid md:grid-cols-3 gap-4 h-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Conversations List */}
        <div className="border-r border-gray-200 overflow-y-auto">
          <h3 className="font-bold text-lg p-4 border-b border-gray-200">
            {t('conversations_title')}
          </h3>

          {conversations.length > 0 ? (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3 items-center mb-2">
                  <span className="text-3xl">{conv.avatar}</span>
                  <div>
                    <p className="font-bold text-gray-800">{conv.userName}</p>
                    <p className="text-xs text-gray-500">{conv.bookTitle}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conv.messages[conv.messages.length - 1]?.content}
                </p>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No conversations</div>
          )}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          {selectedConversation && currentConv ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex gap-3 items-center">
                  <span className="text-3xl">{currentConv.avatar}</span>
                  <div>
                    <p className="font-bold text-gray-800">{currentConv.userName}</p>
                    <p className="text-sm text-gray-500">{currentConv.bookTitle}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentConv.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage(selectedConversation);
                  }}
                  placeholder={t('chat_input_placeholder')}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleSendMessage(selectedConversation)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {t('btn_send')} ➤
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-center">
              <div>
                <p className="text-4xl mb-2">💬</p>
                <p>{t('chat_empty')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
