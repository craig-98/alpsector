export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-brand-border bg-brand-surface border-opacity-50 overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-lg blur-sm opacity-20" />
              <img src="/alpsectorlogo.PNG" alt="Alpsector" className="w-10 h-10 relative bg-brand-dark rounded-lg ring-1 ring-white/10 object-contain" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Alpsector
            </h3>
          </div>
          <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
            The next-generation digital investment platform. Secure, automated trading infrastructure for the modern wealth builder.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-white tracking-wide text-sm uppercase">Platform</h4>
          <ul className="space-y-3 text-brand-muted text-sm font-medium">
            <li><a href="/" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Home</a></li>
            <li><a href="/plans" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Investment Plans</a></li>
            <li><a href="/about" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">About Us</a></li>
            <li><a href="/affiliate" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Affiliate Program</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-white tracking-wide text-sm uppercase">Support</h4>
          <ul className="space-y-3 text-brand-muted text-sm font-medium">
            <li><a href="/faq" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">FAQ</a></li>
            <li><a href="/help" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Help Center</a></li>
            <li><a href="/contact" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-white tracking-wide text-sm uppercase">Legal</h4>
          <ul className="space-y-3 text-brand-muted text-sm font-medium">
            <li><a href="/privacy" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Terms of Service</a></li>
            <li><a href="/risk" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Risk Disclosure</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-brand-border py-8 text-center bg-brand-dark/50">
        <p className="text-brand-muted text-sm px-4">
          © {new Date().getFullYear()} Alpsector Securities. All rights reserved. | Institutional Grade Custody & Execution.
        </p>
      </div>
    </footer>
  );
}
