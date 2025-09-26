import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, Plus, ExternalLink, X } from 'lucide-react';
import HeroSection from './components/HeroSection';
import ToolCard from './components/ToolCard';
import TagsTest from './components/TagsTest';
import { supabase } from './supabaseClient';
import './App.css';

const LibraryPage = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    category: '',
    tags: '',
    pricing: '',
    notes: ''
  });

  // Fetch tools from Supabase
  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTools(data || []);
      setFilteredTools(data || []);
      const uniqueCategories = ['All', ...new Set((data || []).map(tool => tool.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Filter tools based on search and category
  useEffect(() => {
    let filtered = tools;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      console.log('Searching for:', searchTerm, 'in', tools.length, 'tools');
      filtered = filtered.filter(tool => {
        const matches = tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower) ||
          (tool.tags && Array.isArray(tool.tags) && tool.tags.some(tag => 
            tag.toLowerCase().includes(searchLower)
          ));
        if (matches) {
          console.log('Found match:', tool.name);
        }
        return matches;
      });
      console.log('Search results:', filtered.length, 'tools found');
    }
    
    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchTerm]);

  // Add new tool
  const handleAddTool = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated tags string to Postgres array
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const toolData = {
        name: formData.name,
        description: formData.description,
        link: formData.link,
        category: formData.category,
        tags: tagsArray, // This will be stored as text[] in Postgres
        pricing: formData.pricing || null,
        notes: formData.notes || null
      };

      console.log('Adding tool with tags:', toolData);

      const { error } = await supabase
        .from('tools')
        .insert([toolData]);

      if (error) throw error;

      // Reset form and refresh
      setFormData({
        name: '', description: '', link: '', category: '',
        tags: '', pricing: '', notes: ''
      });
      setShowForm(false);
      
      // Small delay to ensure database is updated
      setTimeout(async () => {
        await fetchTools();
      }, 100);
    } catch (err) {
      console.error('Error adding tool:', err);
      setError(err.message);
    }
  };

  const handleStartExploring = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Expanded Overhead lighting effect for loading */}
        <div className="absolute inset-0">
          {/* Primary massive light source */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 200% 150% at center top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.2) 30%, rgba(229,231,235,0.12) 45%, rgba(156,163,175,0.06) 65%, rgba(75,85,99,0.03) 85%, transparent 100%)'
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
        </div>
        
        {/* Extended floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-1 h-1 bg-gray-400 rounded-full opacity-20" style={{ animation: 'float 5s ease-in-out infinite' }}></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-25" style={{ animation: 'float 6s ease-in-out infinite delay-1s' }}></div>
          <div className="absolute top-60 left-5 w-1 h-1 bg-gray-300 rounded-full opacity-15" style={{ animation: 'float 7s ease-in-out infinite delay-2s' }}></div>
          <div className="absolute bottom-40 right-8 w-1 h-1 bg-gray-200 rounded-full opacity-20" style={{ animation: 'float 8s ease-in-out infinite delay-0.5s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4 opacity-60"></div>
          <p className="text-xl text-gray-200">Loading AI Tools...</p>
        </div>
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-10px) translateX(5px); }
            50% { transform: translateY(0px) translateX(-5px); }
            75% { transform: translateY(10px) translateX(3px); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Expanded Overhead lighting effect for error */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 200% 150% at center top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.2) 30%, rgba(229,231,235,0.12) 45%, rgba(156,163,175,0.06) 65%, rgba(75,85,99,0.03) 85%, transparent 100%)'
            }}
          ></div>
          
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-none h-screen blur-3xl"
            style={{
              background: 'radial-gradient(ellipse 2000px 600px at center top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 30%, rgba(229,231,235,0.2) 50%, rgba(156,163,175,0.1) 70%, transparent 90%)',
              width: '200vw',
              left: '-50vw'
            }}
          ></div>
        </div>
        
        <div className="text-center max-w-md mx-auto p-8 relative z-10">
          <div className="bg-gray-800 bg-opacity-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-300 mb-6 bg-red-900 bg-opacity-20 p-3 rounded-lg border border-red-800 backdrop-blur-sm">
            Error: {error}
          </p>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Expanded overhead lighting effect for entire page */}
      <div className="absolute inset-0 fixed">
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

      {/* Enhanced floating light particles with wider distribution */}
      <div className="absolute inset-0 fixed">
        <div className="absolute top-20 left-20 w-1 h-1 bg-gray-400 rounded-full opacity-20" style={{ animation: 'float 5s ease-in-out infinite' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-25" style={{ animation: 'float 6s ease-in-out infinite delay-1s' }}></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-gray-300 rounded-full opacity-15" style={{ animation: 'float 7s ease-in-out infinite delay-2s' }}></div>
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-gray-200 rounded-full opacity-20" style={{ animation: 'float 8s ease-in-out infinite delay-0.5s' }}></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-white rounded-full opacity-30" style={{ animation: 'float 6.5s ease-in-out infinite delay-1.5s' }}></div>
        <div className="absolute bottom-80 right-40 w-1 h-1 bg-gray-400 rounded-full opacity-18" style={{ animation: 'float 9s ease-in-out infinite delay-0.8s' }}></div>
        <div className="absolute top-32 left-5 w-1 h-1 bg-gray-300 rounded-full opacity-22" style={{ animation: 'float 11s ease-in-out infinite delay-2.2s' }}></div>
        <div className="absolute bottom-32 right-8 w-1 h-1 bg-white rounded-full opacity-25" style={{ animation: 'float 13s ease-in-out infinite delay-1.8s' }}></div>
        <div className="absolute top-80 left-8 w-1 h-1 bg-gray-400 rounded-full opacity-20" style={{ animation: 'float 10s ease-in-out infinite delay-3s' }}></div>
        <div className="absolute bottom-20 right-85 w-1 h-1 bg-gray-200 rounded-full opacity-18" style={{ animation: 'float 12s ease-in-out infinite delay-2.5s' }}></div>
      </div>

      <div id="search-section" className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">AI Tools Library</h1>
          <p className="text-gray-300 text-lg">Discover and share the best AI tools for your projects</p>
        </div>

        {/* Add Tool Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
          >
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {showForm ? 'Cancel' : 'Add New Tool'}
          </button>
        </div>

        {/* Add Tool Form */}
        {showForm && (
          <div className="mb-12">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
              <h3 className="text-xl font-bold mb-6 text-white">Add New Tool</h3>
              <form onSubmit={handleAddTool} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Tool Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Website URL *</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="AI, productivity, free"
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Pricing</label>
                    <input
                      type="text"
                      value={formData.pricing}
                      onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                      placeholder="Free, Paid, Freemium"
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none placeholder-gray-400"
                    rows="2"
                    placeholder="Any additional information about this tool"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Add Tool
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, description, category, or tags..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400" 
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  className="pl-10 pr-8 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent min-w-[180px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-1">
              {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'} Found
            </h2>
            <p className="text-gray-300">
              {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'across all categories'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-12 max-w-md mx-auto border border-gray-800 shadow-xl">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">No Tools Found</h3>
              <p className="text-gray-300 mb-6">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="relative bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 hover:shadow-2xl hover:bg-opacity-90 transition-all border border-gray-800 shadow-xl group">
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{tool.category}</p>
                </div>
                
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {tool.description}
                </p>
                
                {tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-800 bg-opacity-60 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700">
                        {tag}
                      </span>
                    ))}
                    {tool.tags.length > 3 && (
                      <span className="bg-gray-800 bg-opacity-60 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">
                        +{tool.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {tool.pricing && (
                  <p className="text-sm text-gray-400 mb-4">
                    <span className="font-medium text-gray-300">Pricing:</span> {tool.pricing}
                  </p>
                )}
                
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Visit Tool
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0px) translateX(-5px); }
          75% { transform: translateY(10px) translateX(3px); }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/tags-test" element={<TagsTest />} />
      </Routes>
    </Router>
  );
}

export default App;