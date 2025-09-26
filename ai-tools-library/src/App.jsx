import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, Plus, ExternalLink, X, Moon, Sun, ChevronDown } from 'lucide-react';
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
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    category: '',
    tags: '',
    pricing: '',
    notes: ''
  });

  // Ref for scroll animation
  const toolCardsRef = useRef([]);

  // Theme classes
  const themeClasses = {
    background: isDarkTheme ? 'bg-black' : 'bg-gray-50',
    text: isDarkTheme ? 'text-white' : 'text-gray-900',
    cardBg: isDarkTheme ? 'bg-gray-950 bg-opacity-70' : 'bg-white bg-opacity-80',
    cardBorder: isDarkTheme ? 'border-gray-800' : 'border-gray-200',
    inputBg: isDarkTheme ? 'bg-gray-800' : 'bg-white',
    inputBorder: isDarkTheme ? 'border-gray-700' : 'border-gray-300',
    inputText: isDarkTheme ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkTheme ? 'text-gray-400' : 'text-gray-600',
    mutedText: isDarkTheme ? 'text-gray-500' : 'text-gray-400',
    button: isDarkTheme ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800',
    secondaryButton: isDarkTheme ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    tagBg: isDarkTheme ? 'bg-gray-800 bg-opacity-60' : 'bg-gray-100',
    tagText: isDarkTheme ? 'text-gray-300' : 'text-gray-700',
    tagBorder: isDarkTheme ? 'border-gray-700' : 'border-gray-200'
  };

  // Generate lighting effect based on theme
  const getLightingEffect = () => {
    return (
      <div className="absolute inset-0 fixed pointer-events-none">
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-none h-screen"
          style={{
            background: isDarkTheme
              ? 'radial-gradient(ellipse 2000px 600px at center top, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)'
              : 'radial-gradient(ellipse 2000px 600px at center top, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)',
            width: '200vw',
            left: '-50vw',
            filter: 'blur(100px)'
          }}
        />
      </div>
    );
  };

  // Generate search suggestions
  const generateSuggestions = (searchValue) => {
    if (!searchValue.trim() || searchValue.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const searchLower = searchValue.toLowerCase();
    const suggestions = new Set();

    // Add matching tool names (prioritize exact matches)
    tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(searchLower)) {
        suggestions.add(tool.name);
      }

      // Add matching tags
      if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchLower)) {
            suggestions.add(tag);
          }
        });
      }
    });

    // Convert to array, prioritize shorter matches, and limit to 6 suggestions
    const sortedSuggestions = Array.from(suggestions)
      .sort((a, b) => {
        // Prioritize exact matches first
        const aExact = a.toLowerCase() === searchLower;
        const bExact = b.toLowerCase() === searchLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Then by length (shorter first)
        return a.length - b.length;
      })
      .slice(0, 6);

    setSearchSuggestions(sortedSuggestions);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(value.length >= 2);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const uniqueCategoriesSet = new Set();
      uniqueCategoriesSet.add('All');

      (data || []).forEach(tool => {
        const category = tool.category ? tool.category.toLowerCase() : '';
        if (category) {
          uniqueCategoriesSet.add(tool.category);
        }
      });

      let uniqueCategories = Array.from(uniqueCategoriesSet);

      if (JSON.stringify(uniqueCategories) !== JSON.stringify(categories)) {
        setCategories(uniqueCategories);
      }

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

  // Filter tools based on search and category (optimized to avoid redundant filtering)
  useEffect(() => {
    let filtered = tools;

    // Apply category filter first (exact match only)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool =>
        tool.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Then apply search filter (searches across all fields)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tool => {
        const nameMatch = tool.name.toLowerCase().includes(searchLower);
        const descriptionMatch = tool.description.toLowerCase().includes(searchLower);
        const categoryMatch = tool.category.toLowerCase().includes(searchLower);
        const tagsMatch = tool.tags && Array.isArray(tool.tags) && tool.tags.some(tag =>
          tag.toLowerCase().includes(searchLower)
        );

        return nameMatch || descriptionMatch || categoryMatch || tagsMatch;
      });
    }

    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchTerm]);

  // Add new tool
  const handleAddTool = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const toolData = {
        name: formData.name,
        description: formData.description,
        link: formData.link,
        category: formData.category,
        tags: tagsArray,
        pricing: formData.pricing || null,
        notes: formData.notes || null
      };

      console.log('Adding tool with tags:', toolData);

      const { error } = await supabase
        .from('tools')
        .insert([toolData]);

      if (error) throw error;

      setFormData({
        name: '', description: '', link: '', category: '',
        tags: '', pricing: '', notes: ''
      });
      setShowForm(false);

      setTimeout(async () => {
        await fetchTools();
      }, 100);
    } catch (err) {
      console.error('Error adding tool:', err);
      setError(err.message);
    }
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0.2
      }
    );

    toolCardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      if (toolCardsRef.current) {
        toolCardsRef.current.forEach((card) => {
          if (card) {
            observer.unobserve(card);
          }
        });
      }
    };
  }, [filteredTools]);


  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} ${themeClasses.text} relative overflow-hidden`}>
        {getLightingEffect()}

        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${isDarkTheme ? 'bg-gray-400' : 'bg-blue-400'} rounded-full opacity-20`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${isDarkTheme ? 'border-white' : 'border-blue-600'} mx-auto mb-4 opacity-60`}></div>
          <p className={`text-xl ${themeClasses.secondaryText}`}>Loading AI Tools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} ${themeClasses.text} relative overflow-hidden`}>
        {getLightingEffect()}

        <div className="text-center max-w-md mx-auto p-8 relative z-10">
          <div className={`${themeClasses.cardBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm`}>
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>Oops! Something went wrong</h2>
          <p className="text-red-300 mb-6 bg-red-900 bg-opacity-20 p-3 rounded-lg border border-red-800 backdrop-blur-sm">
            Error: {error}
          </p>
          <button onClick={() => window.location.reload()} className={`${themeClasses.button} px-6 py-3 rounded-full transition-all duration-300 font-semibold`}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} antialiased`}>
      {getLightingEffect()}

      {/* Floating particles */}
      <div className="absolute inset-0 fixed pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${isDarkTheme ? 'bg-gray-400' : 'bg-blue-400'} rounded-full opacity-20`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 8}s ease-in-out infinite ${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div id="search-section" className="max-w-7xl mx-auto px-6 py-16 relative z-10">

        {/* Header Section with Theme Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex-1">
            <h1 className={`text-5xl font-extrabold ${themeClasses.text} mb-3 tracking-tight`}>AI Tools Library</h1>
            <p className={`${themeClasses.secondaryText} text-xl max-w-2xl`}>Discover and share the best AI tools, APIs, and resources for your creative and professional projects.</p>
          </div>
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border p-3 rounded-lg hover:opacity-80 transition-all backdrop-blur-sm`}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Add Tool Button */}
        <div className="mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${themeClasses.button} px-6 py-3 rounded-full transition-colors flex items-center gap-2 font-medium shadow-lg hover:shadow-xl`}
          >
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {showForm ? 'Cancel' : 'Add New Tool'}
          </button>
        </div>

        {/* Add Tool Form */}
        {showForm && (
          <div className="mb-16">
            <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-3xl p-10 border ${themeClasses.cardBorder} shadow-2xl`}>
              <h3 className={`text-2xl font-bold mb-8 ${themeClasses.text}`}>Add New Tool</h3>
              <form onSubmit={handleAddTool} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Tool Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none`}
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Website URL *</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. AI, productivity, free"
                      className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400`}
                    />
                    <p className={`text-xs ${themeClasses.mutedText} mt-1`}>Separate tags with commas</p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Pricing</label>
                    <input
                      type="text"
                      value={formData.pricing}
                      onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                      placeholder="e.g. Free, Paid, Freemium"
                      className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.secondaryText}`}>Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`w-full px-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none placeholder-gray-400`}
                    rows="2"
                    placeholder="Any additional information about this tool"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className={`${themeClasses.button} px-8 py-3 rounded-full transition-colors font-medium shadow-md hover:shadow-lg`}
                  >
                    Add Tool
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`${themeClasses.secondaryButton} px-8 py-3 rounded-full transition-colors font-medium shadow-md hover:shadow-lg`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filter Section */}
        <div className="mb-10">
          <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-3xl p-8 border ${themeClasses.cardBorder} shadow-2xl`}>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1" ref={searchRef}>
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeClasses.mutedText} transition-colors`} />
                <input
                  type="text"
                  placeholder="Search by name, description, or tags..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                  className={`w-full pl-12 pr-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400`}
                />

                {/* Enhanced Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className={`absolute top-full left-0 right-0 mt-3 ${themeClasses.cardBg} border ${themeClasses.cardBorder} rounded-xl shadow-2xl z-50 backdrop-blur-md overflow-hidden`}
                  >
                    <div className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${themeClasses.mutedText} border-b ${themeClasses.cardBorder} ${isDarkTheme ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-100'}`}>
                      Suggestions
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-4 py-3 cursor-pointer hover:${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'} transition-all duration-150 flex items-center gap-3 ${index === searchSuggestions.length - 1 ? '' : `border-b ${themeClasses.cardBorder} border-opacity-30`}`}
                      >
                        <Search className={`h-4 w-4 ${themeClasses.mutedText} flex-shrink-0`} />
                        <span className={`${themeClasses.text} truncate font-medium`}>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <Filter className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeClasses.mutedText} z-10`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none pl-12 pr-10 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[200px] cursor-pointer`}
                >
                  {categories.map(category => (
                    <option key={category} value={category} className={`${themeClasses.inputBg} ${themeClasses.inputText}`}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeClasses.mutedText} pointer-events-none`} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Summary */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
                {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'} Found
              </h2>
              <p className={`${themeClasses.secondaryText} text-lg`}>
                {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'across all categories'}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            <div className={`hidden sm:flex items-center gap-4 ${themeClasses.secondaryText}`}>
              <Grid className="h-6 w-6" />
              <p className="font-semibold">Grid View</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-xl p-12 max-w-md mx-auto border ${themeClasses.cardBorder} shadow-xl`}>
              <Search className={`h-12 w-12 ${themeClasses.mutedText} mx-auto mb-4`} />
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-3`}>No Tools Found</h3>
              <p className={`${themeClasses.secondaryText} mb-6`}>Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setShowSuggestions(false); }}
                className={`${themeClasses.button} px-6 py-3 rounded-full transition-colors font-semibold`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                ref={el => toolCardsRef.current[index] = el}
                className={`relative ${themeClasses.cardBg} backdrop-blur-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border ${themeClasses.cardBorder} group transform hover:-translate-y-1 opacity-0 translate-y-4`}
                style={{
                  boxShadow: isDarkTheme
                    ? '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    : '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-3 group-hover:text-blue-500 transition-colors duration-200`}>
                    {tool.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 text-sm font-medium ${themeClasses.tagBg} ${themeClasses.tagText} rounded-full border ${themeClasses.tagBorder}`}>
                    {tool.category}
                  </span>
                </div>

                <p className={`${themeClasses.mutedText} mb-6 line-clamp-3 text-base leading-relaxed`}>
                  {tool.description}
                </p>

                {tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className={`${themeClasses.tagBg} ${themeClasses.tagText} text-sm px-3 py-1 rounded-full border ${themeClasses.tagBorder} font-medium`}>
                        {tag}
                      </span>
                    ))}
                    {tool.tags.length > 3 && (
                      <span className={`${themeClasses.tagBg} ${themeClasses.mutedText} text-sm px-3 py-1 rounded-full border ${themeClasses.tagBorder} font-medium`}>
                        +{tool.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {tool.pricing && (
                  <div className={`mb-6 p-3 rounded-lg ${isDarkTheme ? 'bg-gray-800 bg-opacity-40' : 'bg-gray-100'} border ${themeClasses.cardBorder}`}>
                    <p className={`text-sm ${themeClasses.mutedText}`}>
                      <span className={`font-semibold ${themeClasses.secondaryText}`}>Pricing:</span> {tool.pricing}
                    </p>
                  </div>
                )}

                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 ${themeClasses.button} px-6 py-3 rounded-full transition-all duration-200 font-semibold text-base w-full justify-center group-hover:scale-[1.02]`}
                >
                  Visit Tool
                  <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-5px) translateX(3px); }
          50% { transform: translateY(0px) translateX(-3px); }
          75% { transform: translateY(5px) translateX(2px); }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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