'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Footer from '@/components/Footer'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'user'
  const isRider = userType === 'rider'

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
  })
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone' | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userType: isRider ? 'RIDER' : 'USER',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id || data.user._id)
        localStorage.setItem('userType', isRider ? 'RIDER' : 'USER')
        
        if (isRider) {
          router.push('/rider/kyc')
        } else {
          router.push('/user/dashboard')
        }
      } else {
        alert(data.error || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  if (!signupMethod) {
    return (
      <main className="min-h-screen bg-[#FFF9E6] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sign up {isRider ? 'as ZaddyExpress Rider' : ''}
            </h1>
            <p className="text-gray-600 mb-8">
              Choose your signup method
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setSignupMethod('email')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
              >
                Sign up with Email
              </button>
              <button
                onClick={() => setSignupMethod('phone')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
              >
                Sign up with Phone
              </button>
              <Link
                href={isRider ? '/rider/dashboard' : '/user/dashboard'}
                className="block w-full text-center text-gray-600 hover:text-gray-800 mt-4"
              >
                Skip for now
              </Link>
              <Link
                href="/login"
                className="block w-full text-center text-primary-600 hover:text-primary-800 mt-2 font-semibold"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => setSignupMethod(null)}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sign up with {signupMethod === 'email' ? 'Email' : 'Phone'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isRider ? 'Create your rider account' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {signupMethod === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-[#5C4033] bg-white"
                placeholder="your@email.com"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-[#5C4033] bg-white"
                placeholder="+1234567890"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-[#5C4033] bg-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-[#5C4033] bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5C4033] transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
      </div>
      <Footer />
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF9E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-[#5C4033]">Loading...</p>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}

