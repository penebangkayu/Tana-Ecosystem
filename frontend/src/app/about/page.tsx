"use client"

import React from "react"

const AboutPage: React.FC = () => {
  return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Tana Ecosystem
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Tana-Ecosystem is an open ecosystem for building modular, flexible, and easily integrated digital applications. This project focuses on developing solutions in the field of crypto and digital trading, including automatic trading engines, crypto asset management, integration with various blockchain platforms, and market prediction powered by artificial intelligence (AI). Suitable for research, solution development, and real-world deployment—providing a technology foundation that you can expand as needed.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100">
          Features
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>Modular and easily extensible</li>
          <li>Automatic trading engine for crypto and digital trading ecosystems</li>
          <li>Market prediction using artificial intelligence (AI Market Prediction)</li>
          <li>Supports integration with various platforms and services, especially blockchain and crypto ecosystems</li>
          <li>Complete documentation and usage examples</li>
          <li>Open for contributions from the community</li>
        </ul>
      </div>
  )
}

export default AboutPage
