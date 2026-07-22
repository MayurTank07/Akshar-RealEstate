import { lazy, Suspense, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EnquiryForm = lazy(() => import('../pages/Enquiry'));

export default function EnquiryModal({ isOpen, onClose }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-5">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative h-[min(820px,calc(100vh-1.5rem))] w-full max-w-4xl overflow-hidden rounded-[1.6rem] bg-white shadow-2xl ring-1 ring-white/25 animate-in zoom-in duration-300 sm:h-[min(800px,calc(100vh-2.5rem))] sm:rounded-[2rem]">
        <button
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-lg transition hover:border-slate-300 hover:text-slate-900"
        >
          <X size={18} />
        </button>
        
        <div className="h-full overflow-hidden">
          <Suspense fallback={<div className="flex h-full items-center justify-center text-sm font-bold text-slate-500">Loading enquiry form...</div>}>
            <EnquiryForm
              isModal={true}
              onSubmitted={() => setIsSubmitted(true)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
