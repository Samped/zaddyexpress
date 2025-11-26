'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function WithdrawPage() {
  const router = useRouter()
  const [availableBalance, setAvailableBalance] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setAvailableBalance(data.profile.availableBalance)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (amount > availableBalance) {
      alert('Insufficient balance')
      return
    }

    if (!bankAccount) {
      alert('Please enter your bank account details')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount,
          bankAccount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Withdrawal request submitted successfully!')
        router.push('/rider/profile')
      } else {
        alert(data.error || 'Withdrawal failed')
      }
    } catch (error) {
      console.error('Withdrawal error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6] p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/rider/profile" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Make Withdrawal</h1>

          <div className="bg-[#FFF9E8] rounded-lg p-4 mb-6 border-2 border-yellow-200">
            <p className="text-sm text-gray-600 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-primary-600">₦{availableBalance.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">₦</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={availableBalance}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ₦{availableBalance.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Details
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Account Number / IBAN"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading || !withdrawAmount || !bankAccount}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
            >
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

