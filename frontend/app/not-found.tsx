import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF9E6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-[#7A0A0A] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#5C4033] mb-4">Page Not Found</h2>
        <p className="text-[#5C4033]/70 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}


