import React from 'react';

export default function WhatWeDo() {
  return (
    // h-screen and overflow-hidden ensures no page scrolling
    <div className="w-full h-screen bg-white px-6 md:px-12 lg:px-24 flex flex-col py-8 overflow-hidden">
      
      {/* Header - Compacted margins to save vertical space */}
      <div className="mb-6 shrink-0">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
          What we do?
        </h2>
        <p className="mt-3 max-w-5xl text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
          We make land buying, selling, and investing simple and secure with verified listings,
          site visits, and expert guidance. From virtual tours to legal checks and strategy
          sessions, DekhoJamin is your trusted real estate partner.
        </p>
      </div>

      {/* GRID - flex-1 and min-h-0 makes it fill the remaining height without overflowing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0 pb-4">

        {/* LEFT COLUMN - Tall Card */}
        <div className="relative rounded-[32px] overflow-hidden group h-full">
          <img 
            src="/w1.jpg" 
            alt="Land Visit"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 text-white font-semibold text-lg lg:text-xl">
            Land Visit
          </p>
        </div>

        {/* MIDDLE COLUMN - Two Stacked Cards */}
        <div className="flex flex-col gap-4 h-full">
          {/* Top Middle Card */}
          <div className="relative flex-1 rounded-[32px] overflow-hidden group min-h-0">
            <img 
              src="/w3.jpg" 
              alt="Verifying Land papers"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div className="absolute inset-0 bg-black/30" />
            <p className="absolute bottom-6 left-6 text-white font-semibold text-lg leading-tight pr-10">
              Verifying Documents
            </p>
          </div>
          
          {/* Bottom Middle Card */}
          <div className="relative flex-1 rounded-[32px] overflow-hidden group min-h-0">
            <img 
              src="/w4.jpg" 
              alt="Land Strategy Session"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div className="absolute inset-0 bg-black/30" />
            <p className="absolute bottom-6 left-6 text-white font-semibold text-lg">
              Strategy Session
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - Tall Video Card */}
        <div className="relative rounded-[32px] overflow-hidden group h-full">
          <img
            src="/w5.jpg"
            alt="Video Tour"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/10" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition duration-300">
              <div className="w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[14px] md:border-l-[18px] border-l-black border-b-[8px] md:border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
          <p className="absolute bottom-6 left-6 text-white font-semibold text-lg lg:text-xl">
            Video Tour
          </p>
        </div>

      </div>
    </div>
  );
}