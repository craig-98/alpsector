export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about our platform and investment process.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How do I create an account?</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Simply click the <span className="font-semibold text-emerald-600">"Register"</span> button in the top navigation and complete the sign-up process. 
            Account verification is automatic and takes less than 1 minute.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How do I start investing?</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            After funding your account with cryptocurrency or fiat payment, navigate to the <span className="font-semibold text-emerald-600">"Investment Plans"</span> 
            page, choose a plan that matches your financial goals, and confirm your investment.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How long do withdrawals take?</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Withdrawals are typically processed within 24 hours. Cryptocurrency withdrawals are instant once approved, while fiat withdrawals 
            may take up to 3 business days depending on your payment method.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">What payment methods are supported?</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            We support cryptocurrency deposits (Bitcoin, Ethereum, USDT, USDC) and selected fiat payment options including credit/debit cards, 
            bank transfers, and popular e-wallets through our secure payment partners.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Is my investment safe?</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Yes, we use institutional-grade security including two-factor authentication, cold wallet storage for cryptocurrencies, 
            SSL encryption, and regular security audits by third-party firms. Your funds are protected with multiple layers of security.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Can I withdraw profits anytime?</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Yes, you can withdraw your profits and principal at any time during business hours. Processing times vary based on your payment 
            method and verification status. No lock-in periods for withdrawals.
          </p>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 mt-12 text-center">
          <h3 className="text-3xl font-bold text-emerald-800 mb-4">Still have questions?</h3>
          <p className="text-xl text-emerald-700 mb-8">
            Our support team is available 24/7 to help you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/contact" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition shadow-lg">
              Contact Support
            </a>
            <a href="/register" className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 transition shadow-lg">
              Get Started Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
