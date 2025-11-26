import Link from 'next/link'
import { Instagram, Phone, Mail, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#7A0A0A] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ZaddyExpress</h3>
            <p className="text-white/80 text-sm">
              Dispatch Rider at your Fingertips
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="tel:+2349159416637"
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>+234 915 941 6637</span>
              </a>
              <a
                href="mailto:zaddyexpress1@gmail.com"
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>zaddyexpress1@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/zaddy.express/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer relative z-10"
                aria-label="Instagram"
                style={{ pointerEvents: 'auto' }}
              >
                <Instagram className="w-5 h-5 pointer-events-none" />
              </a>
              <a
                href="https://www.facebook.com/share/18K5fohaDF/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer relative z-10"
                aria-label="Facebook"
                style={{ pointerEvents: 'auto' }}
              >
                <Facebook className="w-5 h-5 pointer-events-none" />
              </a>
              <a
                href="https://www.tiktok.com/@zaddy.express"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer relative z-10"
                aria-label="TikTok"
                style={{ pointerEvents: 'auto' }}
              >
                <svg className="w-5 h-5 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/60 text-sm">
            © 2024 ZaddyExpress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

