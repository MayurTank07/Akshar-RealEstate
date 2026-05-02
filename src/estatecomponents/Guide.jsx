import React from 'react';
import { BarChart3, Ruler, ArrowRight } from 'lucide-react';

export default function InfoSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white font-sans">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Image with Floating Card */}
        <div className="relative w-full lg:w-1/2">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1600880212340-efcd7499b1b2?auto=format&fit=crop&q=80&w=1000" 
              alt="Architect discussing plans" 
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          {/* Floating Green Stat Box */}
          <div className="absolute -bottom-6 -right-4 md:right-10 bg-[#065f46] text-white p-8 rounded-2xl shadow-xl z-10">
            <div className="text-4xl font-bold mb-1">98%</div>
            <div className="text-[10px] tracking-[0.2em] font-semibold uppercase opacity-80">
              Client Trust Rate
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2">
          <span className="text-[10px] tracking-[0.2em] font-bold text-indigo-600 uppercase mb-4 block">
            Your Strategic Partner
          </span>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            The Architect's Guide to Property Investment.
          </h2>
          
          <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl">
            We don't just sell houses; we provide structural advice. Our experts evaluate properties 
            through the lens of longevity, design integrity, and market resilience.
          </p>

          {/* Features List */}
          <div className="space-y-8 mb-10">
            {/* Feature 1 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Market Intelligence</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Deep-dive reports into neighborhood growth and demographic shifts.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Ruler className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Structural Review</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every featured listing passes a rigorous architectural and safety audit.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Link */}
          <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-4 transition-all duration-300">
            Schedule a Consultation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}