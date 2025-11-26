'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RiderProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchTransactions()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/transactions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF9E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6] p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/rider/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Rider Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#FFF9E8] rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">₦{((profile?.totalEarnings || 0)).toLocaleString()}</p>
            </div>

            <div className="bg-[#FFF9E8] rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Available Balance</p>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">₦{((profile?.availableBalance || 0)).toLocaleString()}</p>
            </div>

            <div className="bg-[#FFF9E8] rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Rating</p>
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{profile?.rating?.toFixed(1) || '0.0'}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile?.totalRides || 0}</p>
                <p className="text-sm text-gray-600">Total Rides</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.status === 'ONLINE' ? 'Online' : 'Offline'}
                </p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No transactions yet</p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{transaction.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'EARNINGS' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'EARNINGS' ? '+' : '-'}₦{(transaction.amount || 0).toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      transaction.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

