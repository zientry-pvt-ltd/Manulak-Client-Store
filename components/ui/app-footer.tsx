import { COMPANY_INFO } from "@/lib/constants/other";
import { Facebook, Youtube, Mail, MapPin } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Facebook */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <Facebook className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Facebook</h3>
            </div>
            <a
              href={COMPANY_INFO.FACEBOOK_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Follow us on Facebook
            </a>
          </div>
          {/* YouTube */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <Youtube className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">YouTube</h3>
            </div>
            <a
              href={COMPANY_INFO.YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-red-400 transition-colors"
            >
              Subscribe to our channel
            </a>
          </div>
          {/* Tiktok */}
          <div className="flex flex-col items-center md:items-start">
            {/* Placeholder for future TikTok integration */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold">Tiktok</h3>
            </div>
            <a
              href={COMPANY_INFO.TIKTOK_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-pink-400 transition-colors"
            >
              Visit our TikTok Page
            </a>
          </div>
          {/* Email */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold">Email</h3>
            </div>
            <a
              href={`mailto:${COMPANY_INFO.EMAIL}`}
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              {COMPANY_INFO.EMAIL}
            </a>
          </div>
          {/* Location */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <a
              href={COMPANY_INFO.LOCATION}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Find us on the map
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {COMPANY_INFO.NAME} All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
