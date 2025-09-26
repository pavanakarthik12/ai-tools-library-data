import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, Plus, ExternalLink } from 'lucide-react';
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
        {/* Overhead lighting effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 120% 80% at center top, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 40%, rgba(156,163,175,0.05) 70%, transparent 100%)'
            }}
          ></div>
        </div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-1 h-1 bg-gray-400 rounded-full opacity-20" style={{ animation: 'float 5s ease-in-out infinite' }}></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-25" style={{ animation: 'float 6s ease-in-out infinite delay-1s' }}></div>
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
        {/* Overhead lighting effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 120% 80% at center top, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 40%, rgba(156,163,175,0.05) 70%, transparent 100%)'
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Overhead lighting effect for entire page */}
      <div className="absolute inset-0 fixed">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at center top, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 30%, rgba(229,231,235,0.08) 50%, rgba(156,163,175,0.04) 70%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.6) 100%)'
          }}
        ></div>
      </div>

      {/* Floating light particles */}
      <div className="absolute inset-0 fixed">
        <div className="absolute top-20 left-20 w-1 h-1 bg-gray-400 rounded-full opacity-20" style={{ animation: 'float 5s ease-in-out infinite' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-25" style={{ animation: 'float 6s ease-in-out infinite delay-1s' }}></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-gray-300 rounded-full opacity-15" style={{ animation: 'float 7s ease-in-out infinite delay-2s' }}></div>
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-gray-200 rounded-full opacity-20" style={{ animation: 'float 8s ease-in-out infinite delay-0.5s' }}></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-white rounded-full opacity-30" style={{ animation: 'float 6.5s ease-in-out infinite delay-1.5s' }}></div>
        <div className="absolute bottom-80 right-40 w-1 h-1 bg-gray-400 rounded-full opacity-18" style={{ animation: 'float 9s ease-in-out infinite delay-0.8s' }}></div>
      </div>


      
      <div id="search-section" className="container mx-auto px-4 py-12 relative z-10">
        {/* Add Tool Button */}
        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            {showForm ? 'Cancel' : 'Add New Tool'}
          </button>
        </div>

        {/* Add Tool Form */}
        {showForm && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-white">Add New Tool</h3>
              <form onSubmit={handleAddTool} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Link *</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="e.g., AI, productivity, free"
                      className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Pricing</label>
                    <input
                      type="text"
                      value={formData.pricing}
                      onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                      placeholder="e.g., Free, Paid, Freemium"
                      className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                    rows="2"
                    placeholder="Additional notes or comments"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Add Tool
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tools by name, description, category, or tags..." 
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
                  className="pl-10 pr-8 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent min-w-[160px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'} Found
            </h2>
            <p className="text-gray-300">
              {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'across all categories'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Tools List */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-xl p-12 max-w-md mx-auto border border-gray-800">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Tools Found</h3>
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
              <div key={tool.id} className="relative bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-xl p-6 hover:shadow-2xl hover:bg-opacity-90 transition-all border border-gray-800">
                
                <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{tool.category}</p>
                <p className="text-gray-400 mb-4 line-clamp-3">{tool.description}</p>
                
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