'use client';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-green-500">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 bg-clip-text text-transparent text-center mb-4">
          Swap Your School Textbooks
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          The simple platform to exchange your school books for free. Find exactly what you need from fellow students.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setCurrentPage('browse')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Browse Books
          </button>
          <button
            onClick={() => setCurrentPage('offer')}
            className="px-8 py-3 bg-white text-green-500 border-3 border-green-500 font-semibold rounded-full hover:bg-green-500 hover:text-white hover:scale-105 transition-all"
          >
            Offer Books
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Why SwapBook?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4 text-center">✨</div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Free
            </h3>
            <p className="text-gray-600 text-center">
              No money involved. Swap your books for free and find exactly what you need.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4 text-center">🌍</div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Ecological
            </h3>
            <p className="text-gray-600 text-center">
              Give textbooks a second life and reduce waste. Be part of the solution.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600 hover:shadow-xl hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4 text-center">⚡</div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Simple
            </h3>
            <p className="text-gray-600 text-center">
              Easy to use interface. Offer your books and find swap partners in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to start swapping?</h3>
        <p className="mb-6 text-lg">Join SwapBook today and connect with other students at your school</p>
        <button
          onClick={() => setCurrentPage('browse')}
          className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all"
        >
          Explore Books
        </button>
      </div>
    </div>
  );
}
