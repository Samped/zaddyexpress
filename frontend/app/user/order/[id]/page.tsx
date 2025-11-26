'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { Phone, MessageSquare, MapPin, DollarSign, Star } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import Footer from '@/components/Footer'

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [inCall, setInCall] = useState(false)

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    }
  }, [orderId])

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000')
    setSocket(newSocket)

    // Join order room
    newSocket.emit('join-chat', orderId)

    // Listen for messages
    newSocket.on('new-message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    // Listen for location updates
    newSocket.on('location-update', (data) => {
      setRiderLocation({ lat: data.lat, lng: data.lng })
    })

    // Listen for order updates
    newSocket.on('order-accepted', (data) => {
      fetchOrder()
    })

    // Fetch order details
    fetchOrder()

    return () => {
      newSocket.disconnect()
    }
  }, [orderId, fetchOrder])

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return

    socket.emit('send-message', {
      orderId,
      message: newMessage,
      senderId: localStorage.getItem('userId'),
      senderType: 'USER',
    })

    setMessages((prev) => [...prev, {
      message: newMessage,
      senderId: localStorage.getItem('userId'),
      senderType: 'USER',
      timestamp: new Date(),
    }])

    setNewMessage('')
  }

  const initiateCall = () => {
    if (!socket) return

    socket.emit('call-request', {
      orderId,
      callerId: localStorage.getItem('userId'),
      targetUserId: order?.riderId,
    })

    setInCall(true)
  }

  const handlePayment = async () => {
    router.push(`/user/payment/${orderId}`)
  }

  const handleRating = () => {
    router.push(`/user/rating/${orderId}`)
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#FFF9E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A0A0A] mx-auto"></div>
          <p className="mt-4 text-[#5C4033]">Loading order...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#7A0A0A] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
            <span className="text-xl sm:text-2xl text-white px-3 py-1.5 font-montserrat font-extrabold" style={{ letterSpacing: '0.02em' }}>ZaddyExpress</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Order Details</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 mt-6">
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#5C4033]/70">Status</p>
              <p className="font-semibold text-[#5C4033] capitalize">{order.status.toLowerCase().replace('_', ' ')}</p>
            </div>

            <div>
              <p className="text-sm text-[#5C4033]/70">Pickup</p>
              <p className="font-semibold text-[#5C4033]">{order.pickupAddress}</p>
            </div>

            <div>
              <p className="text-sm text-[#5C4033]/70">Dropoff</p>
              <p className="font-semibold text-[#5C4033]">{order.dropoffAddress}</p>
            </div>

            <div>
              <p className="text-sm text-[#5C4033]/70">Price</p>
              <p className="font-semibold text-[#7A0A0A]">₦{((order.finalPrice || order.bidPrice) || 0).toLocaleString()}</p>
            </div>

            {order.riderId && (
              <div>
                <p className="text-sm text-gray-600">Rider Status</p>
                <p className="font-semibold text-green-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  Rider Online / In Transit
                </p>
              </div>
            )}
          </div>
        </div>

        {order.status === 'ACCEPTED' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
            <h2 className="text-xl font-bold text-[#5C4033] mb-4">Communication</h2>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={initiateCall}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-2xl font-bold shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2 text-[#36454F]" />
                Call Rider
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="h-64 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.senderType === 'USER'
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
                  className="flex-1 px-4 py-2 bg-[#FFF9E8] border-2 border-[#FFF9E8] rounded-lg focus:ring-2 focus:ring-[#7A0A0A] focus:border-[#7A0A0A] text-[#5C4033] placeholder:text-[#5C4033]/50"
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-2xl font-bold shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
                >
                  <MessageSquare className="w-5 h-5 text-[#36454F]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {order.status === 'COMPLETED' && order.paymentStatus === 'PENDING' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-[#5C4033] mb-4">Payment</h2>
            <p className="text-[#5C4033]/70 mb-4">Please complete payment to finish the ride.</p>
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
            >
              <DollarSign className="w-5 h-5 inline mr-2 text-[#36454F]" />
              Pay ₦{((order.finalPrice || order.bidPrice) || 0).toLocaleString()}
            </button>
          </div>
        )}

        {order.status === 'COMPLETED' && order.paymentStatus === 'COMPLETED' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-[#5C4033] mb-4">Rate Your Experience</h2>
            <button
              onClick={handleRating}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
            >
              <Star className="w-5 h-5 inline mr-2 text-[#36454F]" />
              Rate Rider
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

