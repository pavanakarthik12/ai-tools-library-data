import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Linkedin, Users, Heart, Code, Lightbulb } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartExploring = () => {
    navigate('/library');
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Expanded Overhead Light Effect - Lighter and Full Page Coverage */}
      <div className="absolute inset-0">
        {/* Main overhead light source - expanded and lighter */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at center top, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 20%, rgba(229,231,235,0.15) 40%, rgba(156,163,175,0.08) 60%, rgba(75,85,99,0.05) 80%, transparent 100%)'
          }}
        ></div>
        
        {/* Secondary ambient layer - softer */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse 100% 70% at center 20%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, rgba(229,231,235,0.1) 50%, rgba(156,163,175,0.05) 70%, transparent 90%)'
          }}
        ></div>
        
        {/* Core bright spot - more diffused */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-96 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse 1000px 300px at center top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, rgba(229,231,235,0.15) 70%, transparent 90%)'
          }}
        ></div>
        
        {/* Gentle vignette - much lighter */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 110% 100% at center center, transparent 0%, transparent 70%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.3) 100%)'
          }}
        ></div>
      </div>

      {/* Softer floating light particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-1 h-1 bg-gray-400 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-gray-300 rounded-full animate-pulse delay-500 opacity-15"></div>
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-gray-200 rounded-full animate-pulse delay-700 opacity-20"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300 opacity-30"></div>
        <div className="absolute bottom-80 right-40 w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-900 opacity-18"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-gray-300 rounded-full animate-pulse delay-400 opacity-22"></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-white rounded-full animate-pulse delay-800 opacity-25"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Icon cluster */}
        <div className="flex gap-4 mb-8 opacity-80">
          <Code className="w-6 h-6 text-gray-200 animate-pulse" />
          <Users className="w-6 h-6 text-gray-100 animate-pulse delay-200" />
          <Heart className="w-6 h-6 text-gray-200 animate-pulse delay-400" />
          <Lightbulb className="w-6 h-6 text-gray-100 animate-pulse delay-600" />
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-8 leading-tight">
          <span className="block text-white mb-4 tracking-wide drop-shadow-2xl">WELCOME TO</span>
          <span className="block text-white font-black tracking-wider drop-shadow-2xl">
            AI LIBRARY
          </span>
        </h1>

        {/* Community description */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed">
            Where We Help Each Other
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
            A collaborative community dedicated to sharing knowledge, contributing valuable tools, 
            and empowering developers worldwide. Together, we build the future of AI development.
          </p>
          <p className="text-md md:text-lg text-gray-400 leading-relaxed">
            Join thousands of contributors who believe in open collaboration, 
            knowledge sharing, and making AI accessible to everyone.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartExploring}
          className="group relative bg-white text-black px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 mb-16"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Exploring
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          </span>
          <div className="absolute inset-0 bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
          <div className="text-center group">
            <div className="text-3xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors">
              Open Source
            </div>
            <div className="text-gray-400">Community Driven</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors">
              Contributors
            </div>
            <div className="text-gray-400">Worldwide Network</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors">
              Free Always
            </div>
            <div className="text-gray-400">No Barriers</div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <p className="text-gray-300 mb-6">Ready to contribute or need help? Let's connect!</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="mailto:pavanakarthikeya@gmail.com"
              className="group flex items-center gap-3 text-gray-200 hover:text-white transition-colors duration-300"
            >
              <Mail className="w-5 h-5 group-hover:animate-pulse" />
              <span>pavanakarthikeya@gmail.com</span>
            </a>
            <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
            <a 
              href="https://www.linkedin.com/in/pavan-karthik-a377b632b/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-gray-200 hover:text-white transition-colors duration-300"
            >
              <Linkedin className="w-5 h-5 group-hover:animate-pulse" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default HeroSection;