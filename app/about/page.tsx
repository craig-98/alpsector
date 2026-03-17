import { Lock, Zap, Target, Eye, Globe, Mail, Phone, MapPin, Instagram } from "lucide-react"
import Footer from "@/components/Footer"

export default function About() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-6">
            About Our Company
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our mission is to make digital investments accessible, secure, and profitable for individuals around the world.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Advanced Technology Meets Financial Expertise</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              By combining advanced technology with financial expertise, we deliver automated trading solutions that maximize opportunities in global markets. 
              Our proprietary algorithms analyze market data 24/7 to identify profitable trading opportunities across cryptocurrencies, forex, stocks, and commodities.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white border rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-xl mb-2">Institutional Security</h4>
                <p className="text-gray-600">Bank-grade encryption and compliance standards.</p>
              </div>
              <div className="bg-white border rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-xl mb-2">Lightning Fast</h4>
                <p className="text-gray-600">Execute trades in milliseconds across global markets.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl p-12 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-6">Global Markets Access</h3>
              <p className="text-blue-100 text-lg mb-8">
                Trade 24/7 across 50+ cryptocurrency pairs, 100+ forex pairs, major indices, and commodities.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-white mb-1">Cryptocurrencies</div>
                  <div className="text-blue-100">50+ pairs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-white mb-1">Forex</div>
                  <div className="text-blue-100">100+ pairs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-white mb-1">Indices</div>
                  <div className="text-blue-100">20+ markets</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-white mb-1">Commodities</div>
                  <div className="text-blue-100">15+ assets</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-10 text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission</h3>
            <p className="text-gray-600">
              Democratize access to institutional-grade trading strategies for retail investors worldwide.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-10 text-center">
            <div className="w-20 h-20 bg-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision</h3>
            <p className="text-gray-600">
              Become the leading global platform for automated investment solutions by 2026.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-10 text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Presence</h3>
            <p className="text-gray-600">
              Serving investors in 150+ countries with multi-language support and localized services.
            </p>
          </div>
        </div>

        {/* Our Team Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Meet the experts driving innovation at Alpinvest</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Michael Thompson */}
            <div className="group bg-[#f5f5f5] rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center max-w-sm w-full mx-auto">
              <img 
                src="/davidnicholls.JPG" 
                alt="Michael Thompson"
                className="w-28 h-28 rounded-full mx-auto shadow-lg object-cover"
              />
              <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2">Michael Thompson</h3>
              <p className="text-sm font-medium text-gray-600 mb-3">CEO</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Expert in financial markets and investment strategies.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Instagram className="w-5 h-5 text-pink-600" />
                <span className="font-medium">@michaelthompson</span>
              </div>
            </div>

            {/* Sarah Chen */}
            <div className="group bg-[#f5f5f5] rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center max-w-sm w-full mx-auto">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mx-auto shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-tight">SC</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2">Sarah Chen</h3>
              <p className="text-sm font-medium text-gray-600 mb-3">CTO</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Technology leader driving AI-powered trading innovation.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Instagram className="w-5 h-5 text-pink-600" />
                <span className="font-medium">@sarahchen</span>
              </div>
            </div>

            {/* David Nicholls */}
            <div className="group bg-[#f5f5f5] rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center max-w-sm w-full mx-auto">
              <img 
                src="/toddpresely.JPG" 
                alt="David Nicholls"
                className="w-28 h-28 rounded-full mx-auto shadow-lg object-cover"
              />
              <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2">David Nicholls</h3>
              <p className="text-sm font-medium text-gray-600 mb-3">CFO</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Financial strategist with 20+ years in hedge funds.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Instagram className="w-5 h-5 text-pink-600" />
                <span className="font-medium">@davidnicholls</span>
              </div>
            </div>
          </div>
        </section>

        {/* Get In Touch Section */}
        <section className="py-20 border-t border-slate-200">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our platform or investment strategies? We are here to help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Email Card */}
            <div className="bg-white border rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all group text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <Mail className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 mb-6">Reach out via email</p>
              <a href="mailto:support@grandvest.org" className="text-emerald-600 font-bold text-lg hover:text-emerald-700">
                support@grandvest.org
              </a>
            </div>
            
            {/* Phone Card */}
            <div className="bg-white border rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all group text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <Phone className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Phone</h3>
              <p className="text-gray-600 mb-6">Talk to us</p>
              <a href="tel:+15551234567" className="text-blue-600 font-bold text-lg hover:text-blue-700">
                +1 (555) 123-4567
              </a>
            </div>
            
            {/* Location Card */}
            <div className="bg-white border rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all group text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <MapPin className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Location</h3>
              <p className="text-gray-600 mb-6">Visit us at our office</p>
              <div className="font-bold text-gray-900 text-lg">123 Main St<br/>Anytown, USA</div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}
