'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Camera } from 'lucide-react'

export default function KYCPage() {
  const router = useRouter()
  const [nin, setNin] = useState('')
  const [faceImage, setFaceImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFaceImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startFaceCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please upload an image instead.')
    }
  }

  const captureFace = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setFaceImage(imageData)
        
        // Stop the video stream
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        setIsCapturing(false)
      }
    }
  }

  const handleSubmit = async () => {
    if (!nin || !faceImage) {
      alert('Please provide both NIN and face recognition data')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rider/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nin,
          faceRecognitionData: faceImage,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('KYC verification submitted successfully!')
        router.push('/rider/dashboard')
      } else {
        alert(data.error || 'KYC submission failed')
      }
    } catch (error) {
      console.error('KYC error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF9E6] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">KYC Verification</h1>
          <p className="text-gray-600 mb-6">
            Please provide your National Identification Number (NIN) and complete face recognition
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National Identification Number (NIN)
              </label>
              <input
                type="text"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your NIN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Face Recognition
              </label>
              
              {!faceImage ? (
                <div className="space-y-4">
                  {isCapturing ? (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border border-gray-300"
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={captureFace}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-2xl font-bold shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500"
                        >
                          Capture Photo
                        </button>
                        <button
                          onClick={() => {
                            if (videoRef.current?.srcObject) {
                              const stream = videoRef.current.srcObject as MediaStream
                              stream.getTracks().forEach(track => track.stop())
                            }
                            setIsCapturing(false)
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={startFaceCapture}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-2xl font-bold shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500 flex items-center justify-center"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Use Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Image
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <Image
                    src={faceImage}
                    alt="Face capture"
                    width={400}
                    height={300}
                    className="w-full rounded-lg border border-gray-300"
                    unoptimized
                  />
                  <button
                    onClick={() => setFaceImage(null)}
                    className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !nin || !faceImage}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
            >
              {loading ? 'Submitting...' : 'Submit KYC'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

