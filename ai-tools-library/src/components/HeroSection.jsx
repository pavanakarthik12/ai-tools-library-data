import React from 'react';

const HeroSection = ({ onStartExploring }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 py-24 px-4 text-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-6"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce delay-500"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-bounce delay-700"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          <span className="block">AI Tools</span>
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Library
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
          Explore the best AI apps, frameworks, and resources
        </p>
        
        <button
          onClick={onStartExploring}
          className="group relative bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <span className="relative z-10">Start Exploring</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-white">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-200">AI Tools</div>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold mb-2">20+</div>
            <div className="text-blue-200">Categories</div>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-blue-200">Free Access</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;