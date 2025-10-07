'use client'

import React from "react"

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#181818] text-gray-100 transition-colors duration-500 font-[Poppins] flex justify-center items-start py-16 px-6">
      <div className="max-w-5xl w-full bg-[#1f1f1f]/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#2b2b2b] space-y-6">
        
        <h1 className="text-4xl font-extrabold mb-4 text-center sm:text-left">
          <span className="text-[#603abd]">Tana</span> Ecosystem
        </h1>

        <p className="text-gray-300 leading-relaxed text-justify">
          <strong className="text-white">Tana Ecosystem</strong> is an open ecosystem for building modular, flexible, and easily integrated digital applications. 
          This project focuses on developing solutions in the field of <span className="text-[#603abd] font-medium">crypto and digital trading</span>, 
          including automatic trading engines, crypto asset management, integration with blockchain platforms, and 
          market prediction powered by <span className="text-[#603abd] font-medium">artificial intelligence (AI)</span>.  
          Suitable for research, solution development, and real-world deployment — providing a solid technological foundation that can be 
          expanded as needed.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#603abd] rounded-full inline-block"></span>
          Features
        </h2>

        <ul className="list-disc list-inside text-gray-300 space-y-2 pl-2">
          <li>Modular and easily extensible architecture</li>
          <li>Automatic trading engine for crypto and digital markets</li>
          <li>Market prediction using artificial intelligence (AI Market Prediction)</li>
          <li>Integration-ready with multiple blockchain platforms and APIs</li>
          <li>Comprehensive documentation and practical examples</li>
          <li>Open for community collaboration and contributions</li>
        </ul>
      </div>
    </div>
  )
}

export default AboutPage
