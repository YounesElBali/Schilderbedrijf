import Link from 'next/link';

export default function OrderFailed() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Er is een fout opgetreden
            </h1>

            <p className="text-lg text-gray-600 mb-8">
                Er is een fout opgetreden bij het verwerken van je bestelling.
            </p>

            <div className="mt-8">
              <Link 
                href="/"
                className="inline-block bg-[#d6ac0a] text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Terug naar home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } 