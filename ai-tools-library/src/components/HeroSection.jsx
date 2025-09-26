import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Linkedin, Users, Heart, Code, Lightbulb } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [animationStarted, setAnimationStarted] = useState(false);

  const handleStartExploring = () => {
    navigate('/library');
  };

  useEffect(() => {
    // Trigger animation on component mount
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Split text into words for kinetic typography
  const welcomeWords = ['WELCOME', 'TO'];
  const libraryWords = ['AI', 'LIBRARY'];
  const subtitleWords = ['Where', 'We', 'Help', 'Each', 'Other'];
  const descWords = ['A', 'collaborative', 'community', 'dedicated', 'to', 'sharing', 'knowledge,', 'contributing', 'valuable', 'tools,', 'and', 'empowering', 'developers', 'worldwide.', 'Together,', 'we', 'build', 'the', 'future', 'of', 'AI', 'development.'];
  const finalWords = ['Join', 'thousands', 'of', 'contributors', 'who', 'believe', 'in', 'open', 'collaboration,', 'knowledge', 'sharing,', 'and', 'making', 'AI', 'accessible', 'to', 'everyone.'];

  const AnimatedWord = ({ word, delay, isTitle = false, isSubtitle = false, className = "" }) => (
    <span
      className={`inline-block animate-word-float ${className} ${isTitle ? 'kinetic-title' : isSubtitle ? 'kinetic-subtitle' : 'kinetic-text'}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {word}
    </span>
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Expanded Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-background-expanded"></div>
      </div>

      {/* Expanded Overhead Light Effect - Much Larger Coverage */}
      <div className="absolute inset-0">
        {/* Primary massive light source */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse 200% 150% at center top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.2) 30%, rgba(229,231,235,0.12) 45%, rgba(156,163,175,0.06) 65%, rgba(75,85,99,0.03) 85%, transparent 100%)'
          }}
        ></div>
        
        {/* Secondary expansive ambient layer */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse 180% 120% at center 15%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 25%, rgba(229,231,235,0.15) 40%, rgba(156,163,175,0.08) 60%, rgba(75,85,99,0.04) 80%, transparent 95%)'
          }}
        ></div>
        
        {/* Ultra-wide core bright spot */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-none h-screen blur-3xl"
          style={{
            background: 'radial-gradient(ellipse 2000px 600px at center top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 30%, rgba(229,231,235,0.2) 50%, rgba(156,163,175,0.1) 70%, transparent 90%)',
            width: '200vw',
            left: '-50vw'
          }}
        ></div>
        
        {/* Extended side lighting */}
        <div 
          className="absolute top-1/4 left-0 w-96 h-96 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
            transform: 'translateX(-50%)'
          }}
        ></div>
        
        <div 
          className="absolute top-1/4 right-0 w-96 h-96 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
            transform: 'translateX(50%)'
          }}
        ></div>
        
        {/* Softer, wider vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 140% 120% at center center, transparent 0%, transparent 60%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.15) 90%, rgba(0,0,0,0.4) 100%)'
          }}
        ></div>
      </div>

      {/* Enhanced floating particles with wider distribution */}
      <div className="absolute inset-0">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
        <div className="floating-particle particle-4"></div>
        <div className="floating-particle particle-5"></div>
        <div className="floating-particle particle-6"></div>
        <div className="floating-particle particle-7"></div>
        <div className="floating-particle particle-8"></div>
        <div className="floating-particle particle-9"></div>
        <div className="floating-particle particle-10"></div>
        <div className="floating-particle particle-11"></div>
        <div className="floating-particle particle-12"></div>
        <div className="floating-particle particle-13"></div>
        <div className="floating-particle particle-14"></div>
        <div className="floating-particle particle-15"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Animated Icon cluster */}
        <div className="flex gap-4 mb-8 opacity-80">
          <Code className="w-6 h-6 text-gray-200 animate-pulse kinetic-icon" style={{animationDelay: '100ms'}} />
          <Users className="w-6 h-6 text-gray-100 animate-pulse delay-200 kinetic-icon" style={{animationDelay: '200ms'}} />
          <Heart className="w-6 h-6 text-gray-200 animate-pulse delay-400 kinetic-icon" style={{animationDelay: '300ms'}} />
          <Lightbulb className="w-6 h-6 text-gray-100 animate-pulse delay-600 kinetic-icon" style={{animationDelay: '400ms'}} />
        </div>

        {/* Kinetic Typography Main heading */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-8 leading-tight">
          <div className="block mb-4 tracking-wide">
            {welcomeWords.map((word, index) => (
              <AnimatedWord 
                key={index} 
                word={word} 
                delay={500 + index * 200} 
                isTitle={true}
                className="mr-4"
              />
            ))}
          </div>
          <div className="block font-black tracking-wider">
            {libraryWords.map((word, index) => (
              <AnimatedWord 
                key={index} 
                word={word} 
                delay={900 + index * 250} 
                isTitle={true}
                className="mr-4 text-glow"
              />
            ))}
          </div>
        </div>

        {/* Kinetic Typography Community description */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="text-xl md:text-2xl mb-6 leading-relaxed">
            {subtitleWords.map((word, index) => (
              <AnimatedWord 
                key={index} 
                word={word} 
                delay={1400 + index * 150} 
                isSubtitle={true}
                className="mr-2 text-gray-200"
              />
            ))}
          </p>
          
          <p className="text-lg md:text-xl mb-4 leading-relaxed">
            {descWords.map((word, index) => (
              <AnimatedWord 
                key={index} 
                word={word} 
                delay={2100 + index * 80} 
                className="mr-1 text-gray-300"
              />
            ))}
          </p>
          
          <p className="text-md md:text-lg leading-relaxed">
            {finalWords.map((word, index) => (
              <AnimatedWord 
                key={index} 
                word={word} 
                delay={3400 + index * 90} 
                className="mr-1 text-gray-400"
              />
            ))}
          </p>
        </div>

        {/* Animated CTA Button */}
        <button
          onClick={handleStartExploring}
          className="group relative bg-white text-black px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 mb-16 kinetic-button"
          style={{animationDelay: '4800ms'}}
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Exploring
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          </span>
          <div className="absolute inset-0 bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Animated Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
          <div className="text-center group kinetic-stat" style={{animationDelay: '5000ms'}}>
            <div className="text-3xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors hover:text-glow">
              Open Source
            </div>
            <div className="text-gray-400">Community Driven</div>
          </div>
          <div className="text-center group kinetic-stat" style={{animationDelay: '5200ms'}}>
            <div className="text-3xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors hover:text-glow">
              Contributors
            </div>
            <div className="text-gray-400">Worldwide Network</div>
          </div>
          <div className="text-center group kinetic-stat" style={{animationDelay: '5400ms'}}>
            <div className="text-3xl font-bold mb-2 text-white group-hover:text-gray-200 transition-colors hover:text-glow">
              Free Always
            </div>
            <div className="text-gray-400">No Barriers</div>
          </div>
        </div>

        {/* Animated Contact Section */}
        <div className="text-center kinetic-contact" style={{animationDelay: '5600ms'}}>
          <p className="text-gray-300 mb-6">Ready to contribute or need help? Let's connect!</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="mailto:pavanakarthikeya@gmail.com"
              className="group flex items-center gap-3 text-gray-200 hover:text-white transition-colors duration-300 hover:text-glow"
            >
              <Mail className="w-5 h-5 group-hover:animate-pulse" />
              <span>pavanakarthikeya@gmail.com</span>
            </a>
            <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
            <a 
              href="https://www.linkedin.com/in/pavan-karthik-a377b632b/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-gray-200 hover:text-white transition-colors duration-300 hover:text-glow"
            >
              <Linkedin className="w-5 h-5 group-hover:animate-pulse" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>

      {/* Kinetic Typography Styles */}
      <style jsx>{`
        .grid-background-expanded {
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          width: 150%;
          height: 150%;
          animation: grid-move-expanded 25s linear infinite;
          transform: translate(-25%, -25%);
        }

        @keyframes grid-move-expanded {
          0% { transform: translate(-25%, -25%); }
          100% { transform: translate(-25% + 80px, -25% + 80px); }
        }

        @keyframes word-float {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
            filter: blur(3px);
          }
          50% {
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .animate-word-float {
          animation: word-float 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .kinetic-title {
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }

        .kinetic-title:hover {
          text-shadow: 0 0 30px rgba(255,255,255,0.6);
          transform: scale(1.05);
        }

        .kinetic-subtitle {
          transition: all 0.3s ease;
        }

        .kinetic-subtitle:hover {
          text-shadow: 0 0 15px rgba(255,255,255,0.4);
          color: white;
        }

        .kinetic-text {
          transition: all 0.3s ease;
        }

        .kinetic-text:hover {
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
          color: #e5e7eb;
        }

        .text-glow {
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        .hover\\:text-glow:hover {
          text-shadow: 0 0 25px rgba(255,255,255,0.7);
        }

        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255,255,255,0.6);
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 { top: 8%; left: 5%; animation: float-particle 8s ease-in-out infinite; }
        .particle-2 { top: 18%; right: 8%; animation: float-particle 10s ease-in-out infinite 1s; }
        .particle-3 { top: 32%; left: 3%; animation: float-particle 12s ease-in-out infinite 2s; }
        .particle-4 { top: 48%; right: 6%; animation: float-particle 9s ease-in-out infinite 3s; }
        .particle-5 { top: 62%; left: 12%; animation: float-particle 11s ease-in-out infinite 1.5s; }
        .particle-6 { top: 25%; right: 25%; animation: float-particle 13s ease-in-out infinite 2.5s; }
        .particle-7 { top: 42%; left: 88%; animation: float-particle 7s ease-in-out infinite 4s; }
        .particle-8 { top: 68%; right: 35%; animation: float-particle 14s ease-in-out infinite 0.5s; }
        .particle-9 { top: 15%; left: 45%; animation: float-particle 6s ease-in-out infinite 3.5s; }
        .particle-10 { top: 78%; right: 15%; animation: float-particle 15s ease-in-out infinite 2s; }
        .particle-11 { top: 35%; left: 92%; animation: float-particle 9s ease-in-out infinite 1.8s; }
        .particle-12 { top: 85%; left: 8%; animation: float-particle 16s ease-in-out infinite 2.2s; }
        .particle-13 { top: 12%; right: 45%; animation: float-particle 11s ease-in-out infinite 4.2s; }
        .particle-14 { top: 55%; left: 25%; animation: float-particle 8s ease-in-out infinite 3.8s; }
        .particle-15 { top: 92%; right: 60%; animation: float-particle 13s ease-in-out infinite 1.2s; }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.2); opacity: 0.8; }
          50% { transform: translateY(0px) translateX(-15px) scale(0.8); opacity: 0.4; }
          75% { transform: translateY(15px) translateX(5px) scale(1.1); opacity: 0.7; }
        }

        .kinetic-icon {
          animation: icon-float 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform: translateY(20px);
          opacity: 0;
        }

        @keyframes icon-float {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .kinetic-button, .kinetic-stat, .kinetic-contact {
          animation: slide-up 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform: translateY(30px);
          opacity: 0;
        }

        @keyframes slide-up {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .kinetic-button:hover {
          box-shadow: 0 0 30px rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;