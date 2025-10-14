import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border-2 border-gray-600 p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Character Not Found
        </h2>
        <p className="text-gray-700 mb-6">
          The character you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/characters"
          className="inline-block px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          Return to Characters
        </Link>
      </div>
    </div>
  )
}
