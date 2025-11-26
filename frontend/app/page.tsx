'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, User, Sparkles, MapPin, Clock, Shield, Star, Circle } from 'lucide-react'
import Image from 'next/image'
import Footer from '@/components/Footer'

export default function Home() {
  const router = useRouter()
  const [userType, setUserType] = useState<'user' | 'rider' | null>(null)

  return (
    <main className="min-h-screen bg-[#FFF9E6] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B451312_1px,transparent_1px),linear-gradient(to_bottom,#8B451312_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-5 bg-[#7A0A0A] shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-2xl sm:text-3xl text-white px-4 py-2 font-montserrat font-extrabold" style={{ letterSpacing: '0.02em' }}>ZaddyExpress</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-white/90 hover:text-white transition-colors font-medium text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all font-medium border border-white/30 text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40 pt-24 sm:pt-28 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.7fr] gap-8 lg:gap-16 items-center">
            <div className="text-left order-2 lg:order-1 space-y-8 flex flex-col justify-center max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full border-2 border-yellow-300 shadow-md hover:shadow-lg transition-shadow w-fit">
                <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
                <span className="text-[#5C4033] text-sm font-semibold">Dispatch Rider at your Fingertips</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#5C4033] leading-tight">
                  <span className="block whitespace-nowrap">Get Connected</span>
                  <span className="block text-[#7A0A0A] mt-2 bg-gradient-to-r from-[#7A0A0A] to-[#8B0000] bg-clip-text text-transparent whitespace-nowrap">
                    to Riders Instantly
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-xl text-[#5C4033]/80 leading-relaxed font-light max-w-xl">
                Enjoy seamless delivery with instant rider matching, real-time tracking, and flexible pricing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => {
                    setUserType('user')
                    setTimeout(() => router.push('/signup?type=user'), 300)
                  }}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 via-green-600 to-green-700 rounded-xl text-white font-bold text-base shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 border border-green-500/20"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>I Need a Ride</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserType('rider')
                    setTimeout(() => router.push('/signup?type=rider'), 300)
                  }}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl text-[#5C4033] font-bold text-base shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 border border-yellow-400/20"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Become a Rider</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end pt-8 lg:pt-16 lg:ml-12">
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/images/zaddyexpress.png"
                    alt="ZaddyExpress delivery riders in red uniforms"
                    width={800}
                    height={800}
                    className="w-full h-auto object-contain"
                    priority
                    quality={95}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#5C4033] mb-4">
                Available <span className="text-[#7A0A0A] bg-gradient-to-r from-[#7A0A0A] to-[#8B0000] bg-clip-text text-transparent">Riders</span>
              </h2>
              <p className="text-lg text-[#5C4033]/70 max-w-2xl mx-auto">
                Connect with our trusted riders ready to serve you
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">John Nnaji</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.8</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700 whitespace-nowrap">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">30+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">Emeka Orji</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.9</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700 whitespace-nowrap">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">20+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">Mike Johnson</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-4 h-4 fill-none text-yellow-400" />
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.2</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
                        <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />
                        <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Offline</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">15+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">Emma Agbo</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-base font-semibold text-[#5C4033] ml-2">5.0</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700 whitespace-nowrap">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">30+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">David Eze</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.7</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700 whitespace-nowrap">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">17+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">Paul Udeh</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.6</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700 whitespace-nowrap">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">22+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">James Wilson</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-4 h-4 fill-none text-yellow-400" />
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.3</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
                        <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />
                        <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Offline</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">35+ rides completed</p>
                  </div>
                </div>
              </Link>

              <Link href="/user/dashboard" className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 border-2 border-green-400 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-30 group-hover:opacity-50 transition-opacity blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors truncate">Chidubem Ike</h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-base font-semibold text-[#5C4033] ml-2">4.9</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-700 whitespace-nowrap">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-[#5C4033]/70 font-medium">25+ rides completed</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#5C4033] text-center mb-12">
              Why Choose <span className="text-[#7A0A0A]">ZaddyExpress</span>?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="group relative bg-white rounded-2xl p-5 border-2 border-yellow-200 hover:border-[#F2D44A] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors">
                    Multiple Locations
                  </h3>
                  <p className="text-[#5C4033]/80 text-sm leading-relaxed">
                    Pickup and dropoff at multiple locations with ease. Plan your route with multiple stops and enjoy seamless navigation.
                  </p>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-5 border-2 border-yellow-200 hover:border-[#F2D44A] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors">
                    Real-Time Tracking
                  </h3>
                  <p className="text-[#5C4033]/80 text-sm leading-relaxed">
                    Live updates on your ride&apos;s location and status. Know exactly where your rider is and when they&apos;ll arrive.
                  </p>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-5 border-2 border-yellow-200 hover:border-[#F2D44A] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors">
                    Secure Payments
                  </h3>
                  <p className="text-[#5C4033]/80 text-sm leading-relaxed">
                    Safe and secure payment options at dropoff. Multiple payment methods including bank transfer and card payments.
                  </p>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-5 border-2 border-yellow-200 hover:border-[#F2D44A] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#5C4033] mb-2 group-hover:text-[#7A0A0A] transition-colors">
                    Peer Pricing
                  </h3>
                  <p className="text-[#5C4033]/80 text-sm leading-relaxed">
                    Bid on fares with our peer-to-peer pricing system. Set your price while respecting the base fare minimum.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-100 text-[#5C4033] rounded-xl hover:bg-yellow-200 transition-all font-medium border-2 border-yellow-400 shadow-sm hover:shadow-md"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

