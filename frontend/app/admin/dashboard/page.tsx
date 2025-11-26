'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>({
    totalUsers: 0,
    totalRiders: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeRiders: 0,
    completedOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF9E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6] p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Riders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalRiders}</p>
              </div>
              <Activity className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Riders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.activeRiders}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
              <Activity className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.completedOrders}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₦{((analytics.totalRevenue || 0)).toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Users (This Month)</span>
                <span className="font-semibold">{analytics.newUsersThisMonth || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users (This Week)</span>
                <span className="font-semibold">{analytics.activeUsersThisWeek || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rider Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Riders (This Month)</span>
                <span className="font-semibold">{analytics.newRidersThisMonth || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-semibold">{analytics.averageRiderRating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

