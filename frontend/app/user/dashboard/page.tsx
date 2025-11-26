'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, Search, DollarSign, User, Mail, Phone, Calendar, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import Footer from '@/components/Footer'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  profilePicture: string | null
  userType: string
  createdAt: string
}

interface Order {
  _id?: string
  id?: string
  pickupAddress: string
  dropoffAddress: string
  status: string
  basePrice: number
  bidPrice: number
  finalPrice?: number
  createdAt: string
  riderId?: {
    _id?: string
    id?: string
    name: string
    phone: string
    profilePicture?: string | null
  } | null
}

export default function UserDashboard() {
  const router = useRouter()
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropoffAddress, setDropoffAddress] = useState('')
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [basePrice, setBasePrice] = useState(0)
  const [bidPrice, setBidPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      console.error('No token or userId found, redirecting to login')
      router.push('/login?type=user')
      return
    }

    fetchUserProfile()
    fetchOrders()

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000')
    setSocket(newSocket)

    if (userId) {
      newSocket.emit('join-room', userId)
    }

    newSocket.on('order-accepted', (data) => {
      fetchOrders()
    })

    const refreshInterval = setInterval(() => {
      fetchOrders()
    }, 10000)

    return () => {
      newSocket.disconnect()
      clearInterval(refreshInterval)
    }
  }, [router])

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const distance = calculateDistance(pickupCoords, dropoffCoords)
      const calculatedBasePrice = Math.max(1000, Math.min(10000, Math.round(1000 + (distance * 450))))
      setBasePrice(calculatedBasePrice)
      setBidPrice(calculatedBasePrice)
    } else {
      setBasePrice(1000)
      setBidPrice(1000)
    }
  }, [pickupCoords, dropoffCoords])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setUserProfile(data.user)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true)
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      
      if (!token) {
        console.error('No token found')
        setLoadingOrders(false)
        return
      }
      
      if (!userId) {
        console.error('No userId found in localStorage')
        setLoadingOrders(false)
        return
      }
      
      console.log('Fetching orders for userId:', userId)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const fullUrl = `${apiUrl}/user/orders`
      console.log('=== FRONTEND: Fetching Orders ===')
      console.log('Full URL:', fullUrl)
      console.log('Token present:', !!token)
      console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'none')
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: `Failed to parse error. Status: ${response.status}`, raw: await response.text() }
        }
        console.error('Error fetching orders:', response.status, errorData)
        setLoadingOrders(false)
        return
      }

      const data = await response.json()
      console.log('=== FRONTEND: Orders Response ===')
      console.log('Response status:', response.status)
      console.log('Response data:', data)
      console.log('Orders array:', data.orders)
      console.log('Orders count:', data.orders?.length || 0)
      console.log('Is array?', Array.isArray(data.orders))
      
      if (data.orders && Array.isArray(data.orders)) {
        console.log('Setting orders:', data.orders.length, 'items')
        setOrders(data.orders)
      } else {
        console.warn('No orders array in response. Full data:', JSON.stringify(data, null, 2))
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Waiting for Rider', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'ACCEPTED':
        return { text: 'Rider Assigned', color: 'bg-blue-100 text-blue-700', icon: CheckCircle }
      case 'IN_PROGRESS':
        return { text: 'In Progress', color: 'bg-green-100 text-green-700', icon: ArrowRight }
      case 'COMPLETED':
        return { text: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle }
      case 'CANCELLED':
        return { text: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle }
      default:
        return { text: status, color: 'bg-gray-100 text-gray-700', icon: Clock }
    }
  }

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const handleGeocode = async (address: string, type: 'pickup' | 'dropoff') => {
    const mockCoords = { lat: 6.5244 + Math.random() * 0.1, lng: 3.3792 + Math.random() * 0.1 }
    
    if (type === 'pickup') {
      setPickupCoords(mockCoords)
    } else {
      setDropoffCoords(mockCoords)
    }
  }

  const handleSearchRider = async () => {
    if (!pickupAddress || !dropoffAddress || !pickupCoords || !dropoffCoords) {
      alert('Please enter both pickup and dropoff addresses')
      return
    }

    if (bidPrice < basePrice) {
      alert(`Bid price must be at least ₦${basePrice.toLocaleString()}`)
      return
    }

    if (bidPrice < 1000 || bidPrice > 10000) {
      alert('Price must be between ₦1,000 and ₦6,000')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          pickupAddress,
          dropoffAddress,
          pickupLat: pickupCoords.lat,
          pickupLng: pickupCoords.lng,
          dropoffLat: dropoffCoords.lat,
          dropoffLng: dropoffCoords.lng,
          basePrice,
          bidPrice,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Order created successfully:', data.order)
        
        if (data.order) {
          const newOrder: Order = {
            _id: data.order._id || data.order.id,
            id: data.order.id || data.order._id,
            pickupAddress: data.order.pickupAddress,
            dropoffAddress: data.order.dropoffAddress,
            status: data.order.status || 'PENDING',
            basePrice: data.order.basePrice,
            bidPrice: data.order.bidPrice,
            finalPrice: data.order.finalPrice,
            createdAt: data.order.createdAt || new Date().toISOString(),
            riderId: null,
          }
          setOrders(prevOrders => [newOrder, ...prevOrders])
        }
        
        setPickupAddress('')
        setDropoffAddress('')
        setPickupCoords(null)
        setDropoffCoords(null)
        setBasePrice(1000)
        setBidPrice(1000)
        
        setTimeout(async () => {
          await fetchOrders()
        }, 1000)
      } else {
        console.error('Order creation failed:', data.error)
        alert(data.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6] flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#7A0A0A] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-xl sm:text-2xl text-white px-3 py-1.5 font-montserrat font-extrabold" style={{ letterSpacing: '0.02em' }}>ZaddyExpress</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Get a Dispatch Rider</h1>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 w-full mt-20">
        {!loadingProfile && userProfile && (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-xl p-6 mb-6 border-2 border-green-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {userProfile.profilePicture ? (
                  <img
                    src={userProfile.profilePicture}
                    alt={userProfile.name || 'User'}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-4 border-green-500 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-[#5C4033] mb-2">
                  Welcome back, {userProfile.name || 'User'}!
                </h2>
                <div className="space-y-2 text-[#5C4033]/80">
                  {userProfile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{userProfile.email}</span>
                    </div>
                  )}
                  {userProfile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{userProfile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Member since {new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#5C4033] mb-2">
              <MapPin className="w-4 h-4 inline mr-1 text-[#36454F]" />
              Pickup Address
            </label>
            <input
              type="text"
              value={pickupAddress}
              onChange={(e) => {
                setPickupAddress(e.target.value)
                if (e.target.value.length > 5) {
                  handleGeocode(e.target.value, 'pickup')
                }
              }}
              className="w-full px-4 py-3 bg-[#FFF9E8] border-2 border-[#FFF9E8] rounded-lg focus:ring-2 focus:ring-[#7A0A0A] focus:border-[#7A0A0A] text-[#5C4033] placeholder:text-[#5C4033]/50"
              placeholder="Enter pickup location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4033] mb-2">
              <MapPin className="w-4 h-4 inline mr-1 text-[#36454F]" />
              Dropoff Address
            </label>
            <input
              type="text"
              value={dropoffAddress}
              onChange={(e) => {
                setDropoffAddress(e.target.value)
                if (e.target.value.length > 5) {
                  handleGeocode(e.target.value, 'dropoff')
                }
              }}
              className="w-full px-4 py-3 bg-[#FFF9E8] border-2 border-[#FFF9E8] rounded-lg focus:ring-2 focus:ring-[#7A0A0A] focus:border-[#7A0A0A] text-[#5C4033] placeholder:text-[#5C4033]/50"
              placeholder="Enter dropoff location"
            />
          </div>

          {basePrice > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#5C4033]">Base Price:</span>
                <span className="text-lg font-bold text-[#7A0A0A]">₦{basePrice.toLocaleString()}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#5C4033] mb-2">
                  Your Bid Price
                </label>
                <input
                  type="number"
                  min={Math.max(1000, basePrice)}
                  max={10000}
                  value={bidPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 1000 && value <= 10000) {
                      setBidPrice(value)
                    }
                  }}
                  className="w-full px-4 py-4 bg-gradient-to-r from-green-50 to-yellow-50 border-3 border-green-400 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 text-[#5C4033] text-lg font-semibold placeholder:text-[#5C4033]/40"
                  placeholder={`₦${basePrice.toLocaleString()}`}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSearchRider}
            disabled={loading || !pickupAddress || !dropoffAddress || bidPrice < basePrice || bidPrice < 1000 || bidPrice > 10000}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2 text-[#36454F]" />
            {loading ? 'Searching for riders...' : 'Search for Rider'}
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#5C4033]">My Orders</h2>
            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loadingOrders ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {loadingOrders ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-[#5C4033]/70 mt-2">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-[#5C4033]/70 text-lg">No orders yet</p>
              <p className="text-[#5C4033]/50 text-sm mt-2">Create your first order above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div
                    key={order._id || order.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:border-green-300 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
                    onClick={() => router.push(`/user/order/${order._id || order.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className={`w-5 h-5 ${statusInfo.color.replace('bg-', 'text-').replace('text-', '')}`} />
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#5C4033] mb-1">
                          ₦{(order.finalPrice || order.bidPrice || 0).toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#5C4033]/50" />
                    </div>

                    <div className="space-y-2 text-sm text-[#5C4033]/80">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-[#5C4033]">Pickup:</p>
                          <p className="truncate">{order.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-[#5C4033]">Dropoff:</p>
                          <p className="truncate">{order.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    {order.riderId && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-[#5C4033]/70">
                          Rider: <span className="font-semibold">{order.riderId.name}</span>
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-[#5C4033]/50">
                        {new Date(order.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

