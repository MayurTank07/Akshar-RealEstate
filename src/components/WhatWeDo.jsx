import React from 'react';
import { Play } from 'lucide-react'; // Optional: if using lucide-react for the play button

export default function WhatWeDo() {
  return (
    <div className="w-full bg-white py-16 px-6 md:px-12 lg:px-24">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          What we do ?
        </h2>
        <p className="mt-6 max-w-6xl text-[15px] leading-relaxed text-gray-600 font-medium">
          We make land buying, selling, and investing simple and secure with verified listings,
          site visits, and expert guidance. From virtual tours to legal checks and strategy
          sessions, DekhoJamin is your trusted real estate partner.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-auto md:h-[550px]">

        {/* LEFT COLUMN - Tall Card */}
        <div className="relative rounded-[32px] overflow-hidden group h-[400px] md:h-full">
          <img 
            src="/w1.jpg" 
            alt="Land Visit"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <p className="absolute bottom-8 left-8 text-white font-semibold text-xl">
            Land Visit
          </p>
        </div>

        {/* MIDDLE COLUMN - Two Stacked Cards */}
        <div className="flex flex-col gap-5 h-[550px] md:h-full">
          {/* Top Middle Card */}
          <div className="relative flex-1 rounded-[32px] overflow-hidden group">
            <img 
              src="/w3.jpg" 
              alt="Verifying Land papers"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div className="absolute inset-0 bg-black/40" />
            <p className="absolute bottom-8 left-8 text-white font-semibold text-xl leading-tight pr-10">
              Verifying Land papers or Documents
            </p>
          </div>
          
          {/* Bottom Middle Card */}
          <div className="relative flex-1 rounded-[32px] overflow-hidden group">
            <img 
              src="/w4.jpg" 
              alt="Land Strategy Session"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div className="absolute inset-0 bg-black/40" />
            <p className="absolute bottom-8 left-8 text-white font-semibold text-xl">
              Land Strategy Session
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - Tall Video Card */}
        <div className="relative rounded-[32px] overflow-hidden group h-[400px] md:h-full">
          <img
            src="/w5.jpg"
            alt="Video Tour"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/10" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition duration-300">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}