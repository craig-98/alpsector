export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black to-dark-grey-900 text-white py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div className="flex items-center">
          <img src="/alpsectorlogo.PNG" alt="Alpsector" className="h-10 sm:h-12 w-auto mr-3 sm:mr-4" />
          <div>
            <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Alpsector
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 sm:mt-2 leading-tight">
              Secure digital investment platform providing automated trading solutions for investors worldwide.
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Company</h4>
          <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm">
            <li><a href="/" className="hover:text-emerald-400 transition-colors block py-1">About</a></li>
            <li><a href="/affiliate" className="hover:text-emerald-400 transition-colors block py-1">Affiliate</a></li>
            <li><a href="/plans" className="hover:text-emerald-400 transition-colors block py-1">Investment Plans</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Support</h4>
          <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm">
            <li><a href="/faq" className="hover:text-emerald-400 transition-colors block py-1">FAQ</a></li>
            <li><a href="/contact" className="hover:text-emerald-400 transition-colors block py-1">Contact</a></li>
            <li><a href="/help" className="hover:text-emerald-400 transition-colors block py-1">Help Center</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Legal</h4>
          <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm">
            <li><a href="/privacy" className="hover:text-emerald-400 transition-colors block py-1">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-emerald-400 transition-colors block py-1">Terms of Service</a></li>
            <li><a href="/risk" className="hover:text-emerald-400 transition-colors block py-1">Risk Disclosure</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
        © 2024 Alpinvest Securities. All rights reserved. | SEC Registered
      </div>
    </footer>
  );
}

