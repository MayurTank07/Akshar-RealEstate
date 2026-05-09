import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import EnquiryForm from '../pages/Enquiry';

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
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors shadow-lg"
        >
          <X size={18} />
        </button>
        
        {/* Form Container */}
        <div className="h-[80vh] overflow-hidden">
          <EnquiryForm 
            isModal={true}
            onSubmitted={() => setIsSubmitted(true)}
          />
        </div>
      </div>
    </div>
  );
}
