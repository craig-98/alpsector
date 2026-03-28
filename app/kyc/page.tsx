'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { kyc } from '@/lib/api';
import { ChevronLeft, UploadCloud, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function KYCPage() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
  });
  
  const [files, setFiles] = useState<{
    document?: File;
    selfie?: File;
    proofOfAddress?: File;
  }>({});

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await kyc.getStatus();
      setStatus(res.data);
    } catch (err) {
      console.log('KYC not found or error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (field: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.document || !files.selfie) {
      toast.error('Identity document and selfie are required');
      return;
    }

    setSubmitting(true);
    try {
      await kyc.submit({
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        document: files.document,
        selfie: files.selfie,
        // API might need updating to support proofOfAddress, but we send it if possible
      });
      toast.success('KYC documents submitted successfully');
      fetchStatus();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-hidden pb-20">
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Identity Verification</h1>
              <p className="text-brand-muted">Complete KYC to unlock institutional limits</p>
            </div>
          </div>
        </div>

        {status ? (
          <div className="glass-panel p-8 text-center max-w-2xl mx-auto">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-2xl ${
              status.status === 'verified' ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-emerald-500/20 text-emerald-400' :
              status.status === 'pending' ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 border-2 border-red-500 shadow-red-500/20 text-red-400'
            }`}>
              {status.status === 'verified' ? <CheckCircle2 className="w-12 h-12" /> :
               status.status === 'pending' ? <ShieldCheck className="w-12 h-12" /> :
               <AlertCircle className="w-12 h-12" />}
            </div>
            <h2 className="text-3xl font-black mb-4 capitalize">{status.status}</h2>
            <p className="text-brand-muted mb-8 text-lg">
              {status.status === 'verified' ? 'Your identity has been successfully verified. You have full access to all institutional features.' :
               status.status === 'pending' ? 'Your documents are currently under review by our compliance team. This usually takes 1-2 business days.' :
               'Your verification was rejected. Please review the requirements and submit again.'}
            </p>
            
            {status.status === 'rejected' && (
              <button 
                onClick={() => setStatus(null)}
                className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Secure KYC Portal</h3>
                <p className="text-sm text-brand-muted">Your data is encrypted and stored securely.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-2">Document Type</label>
                  <select 
                    value={formData.documentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value }))}
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none"
                  >
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="id_card">National ID Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-muted mb-2">Document Number</label>
                  <input 
                    type="text"
                    required
                    value={formData.documentNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <h4 className="font-bold text-lg border-b border-white/10 pb-2">Document Uploads</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-muted">Identity Document *</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/5 hover:border-emerald-500/50 transition-all bg-brand-surface">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className={`w-8 h-8 mb-2 ${files.document ? 'text-emerald-400' : 'text-brand-muted'}`} />
                        <p className="text-sm text-brand-muted font-bold text-center px-4">
                          {files.document ? files.document.name : 'Click to upload specific document'}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange('document')} required />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-muted">Live Selfie *</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/5 hover:border-emerald-500/50 transition-all bg-brand-surface">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className={`w-8 h-8 mb-2 ${files.selfie ? 'text-emerald-400' : 'text-brand-muted'}`} />
                        <p className="text-sm text-brand-muted font-bold text-center px-4">
                          {files.selfie ? files.selfie.name : 'Take a clear selfie'}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" capture="user" onChange={handleFileChange('selfie')} required />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-900 font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Verification'
                )}
              </button>
              <p className="text-center text-xs text-brand-muted mt-4">
                By submitting, you agree to the processing of your personal data according to our Privacy Policy.
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
