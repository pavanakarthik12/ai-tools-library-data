import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid } from 'lucide-react';
import HeroSection from './components/HeroSection';
import ToolCard from './components/ToolCard';
import './App.css';

// Splash page component for HeroSection with redirect
const HeroSplash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/library');
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <HeroSection />
    </div>
  );
};

const LibraryPage = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/pavanakarthik12/ai-tools-library-data/refs/heads/main/tools.json');
        if (!response.ok) {
          throw new Error('Failed to fetch tools data');
        }
        const data = await response.json();
        setTools(data);
        setFilteredTools(data);
        const uniqueCategories = ['All', ...new Set(data.map(tool => tool.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  useEffect(() => {
    let filtered = tools;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchTerm]);

  const handleStartExploring = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading AI Tools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-200">
            Error: {error}
          </p>
          <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <HeroSection onStartExploring={handleStartExploring} />
      {/* Search Section */}
      <div id="search-section" className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tools by name, category, or tags..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500" 
                />
              </div>
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  className="pl-10 pr-8 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white min-w-[160px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <p className="text-2xl font-bold text-gray-800">{filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'} Found</p>
            <p className="text-gray-600">{selectedCategory !== 'All' ? `in ${selectedCategory}` : 'across all categories'}{searchTerm && ` matching "${searchTerm}"`}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Grid className="h-4 w-4" />
            <span>Grid View</span>
          </div>
        </div>
        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-200">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Tools Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any tools matching your search criteria.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSplash />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </Router>
  );
}

export default App;