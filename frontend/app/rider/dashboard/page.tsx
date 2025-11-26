'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Power, DollarSign, TrendingUp, MessageSquare, Phone, MapPin, User, Mail, Calendar, Star } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import Footer from '@/components/Footer'

interface RiderProfile {
  userId: {
    _id: string
    name: string
    email: string
    phone: string
    profilePicture: string | null
  }
  status: string
  totalEarnings: number
  availableBalance: number
  rating: number
  totalRides: number
}

export default function RiderDashboard() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [pendingOrder, setPendingOrder] = useState<any>(null)
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [earnings, setEarnings] = useState({ total: 0, available: 0, rating: 0 })
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [riderProfile, setRiderProfile] = useState<RiderProfile | null>(null)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000')
    setSocket(newSocket)

    const userId = localStorage.getItem('userId')
    if (userId) {
      newSocket.emit('join-room', userId)
    }

    // Listen for order requests
    newSocket.on('order-request', (orderData) => {
      setPendingOrder(orderData)
    })

    // Listen for messages
    newSocket.on('new-message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    fetchRiderProfile()

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const fetchRiderProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setRiderProfile(data.profile)
        setEarnings({
          total: data.profile.totalEarnings,
          available: data.profile.availableBalance,
          rating: data.profile.rating,
        })
        setIsOnline(data.profile.status === 'ONLINE')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline
    setIsOnline(newStatus)

    if (socket) {
      if (newStatus) {
        socket.emit('rider-online', localStorage.getItem('userId'))
      } else {
        socket.emit('rider-offline', localStorage.getItem('userId'))
      }
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus ? 'ONLINE' : 'OFFLINE' }),
      })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleAcceptOrder = async () => {
    if (!socket || !pendingOrder) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId: pendingOrder.id }),
      })

      const data = await response.json()

      if (response.ok) {
        socket.emit('order-accepted', {
          orderId: pendingOrder.id,
          userId: pendingOrder.userId,
        })
        setActiveOrder(data.order)
        setPendingOrder(null)
        if (socket) {
          socket.emit('join-chat', pendingOrder.id)
        }
      }
    } catch (error) {
      console.error('Error accepting order:', error)
    }
  }

  const handleIgnoreOrder = async (reason: string) => {
    if (!socket || !pendingOrder) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/ignore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId: pendingOrder.id,
          reason,
        }),
      })

      socket.emit('order-ignored', {
        orderId: pendingOrder.id,
        reason,
      })

      setPendingOrder(null)
    } catch (error) {
      console.error('Error ignoring order:', error)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !activeOrder) return

    socket.emit('send-message', {
      orderId: activeOrder.id,
      message: newMessage,
      senderId: localStorage.getItem('userId'),
      senderType: 'RIDER',
    })

    setMessages((prev) => [...prev, {
      message: newMessage,
      senderId: localStorage.getItem('userId'),
      senderType: 'RIDER',
      timestamp: new Date(),
    }])

    setNewMessage('')
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#7A0A0A] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-xl sm:text-2xl text-white px-3 py-1.5 font-montserrat font-extrabold" style={{ letterSpacing: '0.02em' }}>ZaddyExpress</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Rider Dashboard</h1>
          </div>
          <button
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
              isOnline
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                : 'bg-gray-400 text-white hover:bg-gray-500'
            }`}
          >
            <Power className="w-5 h-5" />
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-20">
        {riderProfile && riderProfile.userId && (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-xl p-6 mb-6 border-2 border-green-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {riderProfile.userId.profilePicture ? (
                  <Image
                    src={riderProfile.userId.profilePicture}
                    alt={riderProfile.userId.name || 'Rider'}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-4 border-green-500 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#5C4033]">
                    {riderProfile.userId.name || 'Rider'}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="space-y-2 text-[#5C4033]/80 mb-3">
                  {riderProfile.userId.email && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{riderProfile.userId.email}</span>
                    </div>
                  )}
                  {riderProfile.userId.phone && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{riderProfile.userId.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-[#5C4033]">{earnings.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-[#5C4033]/70">{riderProfile.totalRides} rides</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C4033]">Total Earnings</p>
                <p className="text-2xl font-bold text-[#5C4033]">₦{earnings.total.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C4033]">Available Balance</p>
                <p className="text-2xl font-bold text-[#5C4033]">₦{earnings.available.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C4033]">Rating</p>
                <p className="text-2xl font-bold text-[#5C4033]">{earnings.rating.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {pendingOrder && (
          <div className="bg-[#FFE5B4] rounded-xl p-6 mb-6 mt-6 border-2 border-yellow-300 shadow-lg">
            <div className="bg-[#FFF9E8] rounded-lg p-6 border-2 border-yellow-200">
              <h2 className="text-xl font-bold text-[#5C4033] mb-4">New Order Request</h2>
              <div className="space-y-2 mb-4 text-[#5C4033]">
                <p><span className="font-semibold">Pickup:</span> {pendingOrder.pickupAddress}</p>
                <p><span className="font-semibold">Dropoff:</span> {pendingOrder.dropoffAddress}</p>
                <p><span className="font-semibold">Price:</span> ₦{(pendingOrder.bidPrice || 0).toLocaleString()}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAcceptOrder}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-2xl font-bold shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
                >
                  Accept Order
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Reason for ignoring:')
                    if (reason) handleIgnoreOrder(reason)
                  }}
                  className="flex-1 bg-red-400/80 text-white py-3 px-4 rounded-lg font-bold hover:bg-red-500/80 transition-colors shadow-md"
                >
                  Ignore
                </button>
              </div>
            </div>
          </div>
        )}

        {activeOrder && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-[#5C4033] mb-4">Active Order</h2>
            <div className="space-y-2 mb-4 text-[#5C4033]">
              <p><span className="font-semibold">Pickup:</span> {activeOrder.pickupAddress}</p>
              <p><span className="font-semibold">Dropoff:</span> {activeOrder.dropoffAddress}</p>
              <p><span className="font-semibold">Price:</span> ₦{((activeOrder.finalPrice || activeOrder.bidPrice) || 0).toLocaleString()}</p>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Chat with User</h3>
              <div className="h-48 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.senderType === 'RIDER'
                        ? 'bg-primary-100 ml-auto max-w-xs'
                        : 'bg-gray-100 mr-auto max-w-xs'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-2xl font-bold shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-[#5C4033] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/rider/profile')}
              className="bg-[#F2D44A] text-[#5C4033] py-4 px-6 rounded-lg font-bold hover:bg-[#F2D44A]/90 transition-colors shadow-md"
            >
              View Profile & Earnings
            </button>
            <button
              onClick={() => router.push('/rider/withdraw')}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
            >
              Make Withdrawal
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

