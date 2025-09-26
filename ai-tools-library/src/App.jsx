import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, Plus, ExternalLink, X, Moon, Sun, ChevronDown, Info, AlertCircle, Sparkles } from 'lucide-react';
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
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [formErrors, setFormErrors] = useState({});
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

  // Enhanced theme classes with more modern styling
  const themeClasses = {
    background: isDarkTheme 
      ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
      : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    text: isDarkTheme ? 'text-white' : 'text-gray-900',
    cardBg: isDarkTheme 
      ? 'bg-gradient-to-br from-gray-950/90 via-gray-900/80 to-gray-950/90' 
      : 'bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80',
    cardBorder: isDarkTheme ? 'border-gray-700/50' : 'border-white/60',
    inputBg: isDarkTheme ? 'bg-gray-800/70' : 'bg-white/80',
    inputBorder: isDarkTheme ? 'border-gray-600/40' : 'border-gray-200/60',
    inputText: isDarkTheme ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkTheme ? 'text-gray-300' : 'text-gray-600',
    mutedText: isDarkTheme ? 'text-gray-400' : 'text-gray-500',
    button: isDarkTheme 
      ? 'bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-lg hover:shadow-xl' 
      : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl',
    secondaryButton: isDarkTheme 
      ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 hover:from-gray-700 hover:to-gray-600 border border-gray-600/50' 
      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 border border-gray-300/50',
    tagBg: isDarkTheme 
      ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60' 
      : 'bg-gradient-to-r from-blue-100/80 to-indigo-100/80',
    tagText: isDarkTheme ? 'text-gray-200' : 'text-gray-700',
    tagBorder: isDarkTheme ? 'border-gray-600/40' : 'border-blue-200/60',
    warningBg: isDarkTheme ? 'bg-yellow-900/20' : 'bg-yellow-50',
    warningBorder: isDarkTheme ? 'border-yellow-600/40' : 'border-yellow-200',
    warningText: isDarkTheme ? 'text-yellow-300' : 'text-yellow-700',
    errorBg: isDarkTheme ? 'bg-red-900/20' : 'bg-red-50',
    errorBorder: isDarkTheme ? 'border-red-600/40' : 'border-red-200',
    errorText: isDarkTheme ? 'text-red-300' : 'text-red-600',
    infoBg: isDarkTheme ? 'bg-blue-900/20' : 'bg-blue-50',
    infoBorder: isDarkTheme ? 'border-blue-600/40' : 'border-blue-200',
    infoText: isDarkTheme ? 'text-blue-300' : 'text-blue-700'
  };

  // Enhanced lighting effect with more dynamic visuals
  const getLightingEffect = () => {
    return (
      <div className="absolute inset-0 fixed pointer-events-none overflow-hidden">
        {/* Main gradient */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-none h-screen"
          style={{
            background: isDarkTheme
              ? 'radial-gradient(ellipse 2500px 800px at center top, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 30%, rgba(255,255,255,0.02) 60%, transparent 100%)'
              : 'radial-gradient(ellipse 2500px 800px at center top, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.10) 30%, rgba(139,92,246,0.08) 60%, transparent 100%)',
            width: '250vw',
            left: '-75vw',
            filter: 'blur(120px)'
          }}
        />
        
        {/* Secondary accent */}
        <div
          className="absolute bottom-0 right-0 w-full max-w-none h-screen"
          style={{
            background: isDarkTheme
              ? 'radial-gradient(ellipse 1500px 600px at right bottom, rgba(139,92,246,0.06) 0%, rgba(236,72,153,0.03) 50%, transparent 100%)'
              : 'radial-gradient(ellipse 1500px 600px at right bottom, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 50%, transparent 100%)',
            width: '200vw',
            right: '-50vw',
            filter: 'blur(100px)'
          }}
        />

        {/* Floating orbs */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              background: isDarkTheme 
                ? `radial-gradient(circle, rgba(${i === 0 ? '59,130,246' : i === 1 ? '139,92,246' : '236,72,153'},0.1) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(${i === 0 ? '59,130,246' : i === 1 ? '139,92,246' : '236,72,153'},0.2) 0%, transparent 70%)`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              top: `${20 + i * 25}%`,
              left: `${15 + i * 30}%`,
              animation: `float ${8 + i * 2}s ease-in-out infinite ${i * 2}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Predefined categories to prevent duplications
  const predefinedCategories = [
    'AI App Builders',
    'AI Assistants', 
    'AI Automation',
    'API',
    'Data & AI',
    'Generative Media',
    'Hosting',
    'Learning',
    'Productivity',
    'Utilities',
    'Web Development',
    'Website',
    'Writing',
    'Design',
    'Video',
    'Audio',
    'Image Generation',
    'Code Generation',
    'Research',
    'Analytics'
  ];

  // Check for duplicates
  const checkForDuplicates = (name, category) => {
    const duplicateName = tools.find(tool => 
      tool.name.toLowerCase() === name.toLowerCase()
    );
    
    // Check for exact category matches in predefined list
    const exactMatch = predefinedCategories.find(cat => 
      cat.toLowerCase() === category.toLowerCase()
    );
    
    // Check for similar categories in existing tools
    const existingCategories = [...new Set(tools.map(tool => tool.category))];
    const similarCategory = existingCategories.find(cat => 
      cat.toLowerCase() !== category.toLowerCase() && 
      (cat.toLowerCase().includes(category.toLowerCase()) || 
       category.toLowerCase().includes(cat.toLowerCase()))
    );
    
    let warning = '';
    if (duplicateName) {
      warning += `⚠️ A tool named "${duplicateName.name}" already exists. `;
    }
    if (similarCategory && !exactMatch) {
      warning += `💡 Consider using existing category "${similarCategory}" to avoid duplicates.`;
    }
    
    setDuplicateWarning(warning);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Tool name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.link.trim()) errors.link = 'Website URL is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    if (formData.link && !formData.link.match(/^https?:\/\/.+/)) {
      errors.link = 'Please enter a valid URL (starting with http:// or https://)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes with real-time validation
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Check for duplicates in real-time for name and category
    if (field === 'name' || field === 'category') {
      if (formData.name.trim() && formData.category.trim()) {
        checkForDuplicates(
          field === 'name' ? value : formData.name,
          field === 'category' ? value : formData.category
        );
      }
    }
  };

  // Generate search suggestions with enhanced logic
  const generateSuggestions = (searchValue) => {
    if (!searchValue.trim() || searchValue.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const searchLower = searchValue.toLowerCase();
    const suggestions = new Set();

    // Add matching tool names with priority
    tools.forEach(tool => {
      const name = tool.name.toLowerCase();
      if (name.includes(searchLower)) {
        suggestions.add(tool.name);
      }

      // Add matching categories
      if (tool.category.toLowerCase().includes(searchLower)) {
        suggestions.add(tool.category);
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

    // Enhanced sorting logic
    const sortedSuggestions = Array.from(suggestions)
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        
        // Prioritize exact matches
        const aExact = aLower === searchLower;
        const bExact = bLower === searchLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then prioritize starts with
        const aStarts = aLower.startsWith(searchLower);
        const bStarts = bLower.startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Finally by length
        return a.length - b.length;
      })
      .slice(0, 8);

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

  // Fetch tools from Supabase with improved error handling and deduplication
  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTools(data || []);
      setFilteredTools(data || []);
      
      // Build unique categories with deduplication and merge with predefined
      const existingCategories = [...new Set((data || [])
        .map(tool => tool.category)
        .filter(cat => cat && cat.trim())
      )];
      
      // Merge predefined categories with existing ones, removing duplicates
      const allCategories = [...new Set([
        'All',
        ...predefinedCategories,
        ...existingCategories.filter(cat => 
          !predefinedCategories.some(predefined => 
            predefined.toLowerCase() === cat.toLowerCase()
          )
        )
      ])];

      // Sort categories: All first, then alphabetically
      const sortedCategories = allCategories.sort((a, b) => {
        if (a === 'All') return -1;
        if (b === 'All') return 1;
        return a.localeCompare(b);
      });

      setCategories(sortedCategories);

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

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = [...tools];

    // Apply category filter first
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool =>
        tool.category && tool.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter with improved matching
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tool => {
        const nameMatch = tool.name.toLowerCase().includes(searchLower);
        const descriptionMatch = tool.description.toLowerCase().includes(searchLower);
        const categoryMatch = tool.category.toLowerCase().includes(searchLower);
        const tagsMatch = tool.tags && Array.isArray(tool.tags) && 
          tool.tags.some(tag => tag.toLowerCase().includes(searchLower));
        const pricingMatch = tool.pricing && tool.pricing.toLowerCase().includes(searchLower);

        return nameMatch || descriptionMatch || categoryMatch || tagsMatch || pricingMatch;
      });
    }

    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchTerm]);

  // Enhanced add tool function
  const handleAddTool = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError(null);
      
      const tagsArray = formData.tags
        ? formData.tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag)
            .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase())
        : [];

      const toolData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
        category: formData.category.trim(),
        tags: tagsArray,
        pricing: formData.pricing.trim() || null,
        notes: formData.notes.trim() || null
      };

      const { error } = await supabase
        .from('tools')
        .insert([toolData]);

      if (error) throw error;

      // Reset form
      setFormData({
        name: '', description: '', link: '', category: '',
        tags: '', pricing: '', notes: ''
      });
      setFormErrors({});
      setDuplicateWarning('');
      setShowForm(false);

      // Refresh tools list after a short delay
      setTimeout(fetchTools, 100);
      
    } catch (err) {
      console.error('Error adding tool:', err);
      setError(err.message);
    }
  };

  // Enhanced scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeInUp');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    toolCardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      toolCardsRef.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, [filteredTools]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} ${themeClasses.text} relative overflow-hidden`}>
        {getLightingEffect()}

        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${isDarkTheme ? 'bg-blue-400' : 'bg-indigo-400'} rounded-full opacity-30`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite ${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className={`animate-spin rounded-full h-20 w-20 border-4 ${isDarkTheme ? 'border-blue-500/30' : 'border-indigo-500/30'} border-t-blue-500 mx-auto opacity-80`}></div>
            <Sparkles className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 ${isDarkTheme ? 'text-blue-400' : 'text-indigo-500'} animate-pulse`} />
          </div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Loading AI Tools</h2>
          <p className={`text-lg ${themeClasses.secondaryText}`}>Discovering amazing tools for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} ${themeClasses.text} relative overflow-hidden`}>
        {getLightingEffect()}

        <div className="text-center max-w-md mx-auto p-8 relative z-10">
          <div className={`${themeClasses.cardBg} rounded-2xl backdrop-blur-md border ${themeClasses.cardBorder} p-8 shadow-2xl`}>
            <div className={`${themeClasses.errorBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border ${themeClasses.errorBorder}`}>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>Something went wrong</h2>
            <p className={`${themeClasses.errorText} mb-6 p-4 rounded-lg ${themeClasses.errorBg} border ${themeClasses.errorBorder}`}>
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className={`${themeClasses.button} px-6 py-3 rounded-full transition-all duration-300 font-semibold transform hover:scale-105`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} antialiased relative`}>
      {getLightingEffect()}

      {/* Enhanced floating particles */}
      <div className="absolute inset-0 fixed pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${isDarkTheme ? 'bg-blue-400' : 'bg-indigo-400'} opacity-20`}
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div id="search-section" className="max-w-7xl mx-auto px-6 py-16 relative z-10">

        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className={`text-6xl font-black ${themeClasses.text} tracking-tight bg-gradient-to-r ${isDarkTheme ? 'from-white via-blue-200 to-purple-200' : 'from-gray-900 via-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                AI Tools Library
              </h1>
              <Sparkles className={`h-8 w-8 ${isDarkTheme ? 'text-blue-400' : 'text-indigo-500'} animate-pulse`} />
            </div>
            <p className={`${themeClasses.secondaryText} text-xl max-w-3xl leading-relaxed`}>
              Discover, explore, and share the most powerful AI tools, APIs, and resources. 
              Build the future with cutting-edge artificial intelligence solutions.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className={`px-4 py-2 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-sm font-medium`}>
                {tools.length} Tools Available
              </div>
              <div className={`px-4 py-2 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-sm font-medium`}>
                {categories.length - 1} Categories
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`${themeClasses.secondaryButton} p-3 rounded-xl hover:scale-105 transition-all duration-200 backdrop-blur-sm`}
              aria-label="Show guidelines"
            >
              <Info className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border p-3 rounded-xl hover:scale-105 transition-all duration-200 backdrop-blur-sm shadow-lg`}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Guidelines Panel */}
        {showGuidelines && (
          <div className="mb-12">
            <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-3xl p-8 border ${themeClasses.cardBorder} shadow-2xl ${themeClasses.infoBg}`}>
              <h3 className={`text-xl font-bold mb-6 ${themeClasses.infoText} flex items-center gap-3`}>
                <Info className="h-6 w-6" />
                Submission Guidelines
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className={`font-semibold mb-3 ${themeClasses.text}`}>📝 Tool Names</h4>
                  <ul className={`space-y-2 ${themeClasses.secondaryText}`}>
                    <li>• Use the official tool name</li>
                    <li>• Check for existing duplicates</li>
                    <li>• Use proper capitalization</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${themeClasses.text}`}>🏷️ Categories</h4>
                  <ul className={`space-y-2 ${themeClasses.secondaryText}`}>
                    <li>• Use existing categories when possible</li>
                    <li>• Keep categories broad (e.g., "Writing", "Design")</li>
                    <li>• Avoid overly specific categories</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${themeClasses.text}`}>🏷️ Tags</h4>
                  <ul className={`space-y-2 ${themeClasses.secondaryText}`}>
                    <li>• Separate with commas</li>
                    <li>• Use relevant, searchable keywords</li>
                    <li>• Include pricing type (free, paid, freemium)</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${themeClasses.text}`}>💡 Best Practices</h4>
                  <ul className={`space-y-2 ${themeClasses.secondaryText}`}>
                    <li>• Write clear, concise descriptions</li>
                    <li>• Include full URLs with https://</li>
                    <li>• Specify pricing model when known</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowGuidelines(false)}
                className={`mt-6 ${themeClasses.button} px-6 py-2 rounded-full text-sm font-medium transition-all duration-200`}
              >
                Got it!
              </button>
            </div>
          </div>
        )}
        
        {/* Enhanced Add Tool Button */}
        <div className="mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${themeClasses.button} px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 text-lg`}
          >
            {showForm ? (
              <>
                <X className="h-6 w-6" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-6 w-6" />
                Add New Tool
              </>
            )}
          </button>
        </div>

        {/* Enhanced Add Tool Form */}
        {showForm && (
          <div className="mb-16">
            <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-3xl p-12 border ${themeClasses.cardBorder} shadow-2xl relative overflow-hidden`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
              
              <h3 className={`text-3xl font-bold mb-8 ${themeClasses.text} flex items-center gap-3`}>
                <Plus className="h-8 w-8" />
                Add New Tool
              </h3>

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className={`${themeClasses.warningBg} border ${themeClasses.warningBorder} rounded-xl p-4 mb-6 flex items-start gap-3`}>
                  <AlertCircle className={`h-5 w-5 ${themeClasses.warningText} mt-0.5 flex-shrink-0`} />
                  <p className={`${themeClasses.warningText} text-sm font-medium`}>{duplicateWarning}</p>
                </div>
              )}

              <form onSubmit={handleAddTool} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                      Tool Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className={`w-full px-4 py-4 border ${formErrors.name ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm shadow-sm`}
                      placeholder="Enter the official tool name"
                      required
                    />
                    {formErrors.name && (
                      <p className={`mt-2 text-sm ${themeClasses.errorText}`}>{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className={`w-full px-4 py-4 border ${formErrors.category ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer`}
                      required
                    >
                      <option value="">Select a category</option>
                      {predefinedCategories.map((cat, index) => (
                        <option key={index} value={cat} className={`${themeClasses.inputBg} ${themeClasses.inputText} py-2`}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className={`mt-2 text-sm ${themeClasses.errorText}`}>{formErrors.category}</p>
                    )}
                    
                    {/* Custom category input */}
                    <div className="mt-3">
                      <label className={`block text-xs font-medium mb-2 ${themeClasses.mutedText}`}>
                        Or add custom category:
                      </label>
                      <input
                        type="text"
                        placeholder="Enter custom category name"
                        onChange={(e) => {
                          if (e.target.value.trim()) {
                            handleFormChange('category', e.target.value);
                          }
                        }}
                        className={`w-full px-3 py-2 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm shadow-sm text-sm`}
                      />
                      <p className={`text-xs ${themeClasses.mutedText} mt-1`}>
                        Only use custom categories if none of the predefined options fit
                      </p>
                    </div>

                    {/* Show existing categories if any exist beyond predefined */}
                    {categories.length > predefinedCategories.length + 1 && (
                      <div className="mt-3">
                        <p className={`text-xs ${themeClasses.mutedText} mb-2`}>Other existing categories:</p>
                        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                          {categories
                            .filter(cat => cat !== 'All' && !predefinedCategories.includes(cat))
                            .slice(0, 8)
                            .map((cat, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleFormChange('category', cat)}
                                className={`text-xs px-2 py-1 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} hover:opacity-80 transition-opacity`}
                              >
                                {cat}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className={`w-full px-4 py-4 border ${formErrors.description ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none backdrop-blur-sm shadow-sm`}
                    rows="4"
                    placeholder="Describe what this tool does and its key features"
                    required
                  />
                  {formErrors.description && (
                    <p className={`mt-2 text-sm ${themeClasses.errorText}`}>{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleFormChange('link', e.target.value)}
                    className={`w-full px-4 py-4 border ${formErrors.link ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm shadow-sm`}
                    placeholder="https://example.com"
                    required
                  />
                  {formErrors.link && (
                    <p className={`mt-2 text-sm ${themeClasses.errorText}`}>{formErrors.link}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleFormChange('tags', e.target.value)}
                      placeholder="AI, productivity, free, API"
                      className={`w-full px-4 py-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 backdrop-blur-sm shadow-sm`}
                    />
                    <p className={`text-xs ${themeClasses.mutedText} mt-2`}>
                      Separate tags with commas. Include pricing type (free, paid, freemium) if known.
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                      Pricing Model
                    </label>
                    <select
                      value={formData.pricing}
                      onChange={(e) => handleFormChange('pricing', e.target.value)}
                      className={`w-full px-4 py-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer`}
                    >
                      <option value="">Select pricing model</option>
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Subscription">Subscription</option>
                      <option value="One-time">One-time Purchase</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${themeClasses.secondaryText}`}>
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    className={`w-full px-4 py-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none placeholder-gray-400 backdrop-blur-sm shadow-sm`}
                    rows="3"
                    placeholder="Any additional information, special features, or usage notes"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className={`${themeClasses.button} px-10 py-4 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-lg`}
                  >
                    Add Tool
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        name: '', description: '', link: '', category: '',
                        tags: '', pricing: '', notes: ''
                      });
                      setFormErrors({});
                      setDuplicateWarning('');
                    }}
                    className={`${themeClasses.secondaryButton} px-10 py-4 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filter Section */}
        <div className="mb-12">
          <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-3xl p-10 border ${themeClasses.cardBorder} shadow-2xl relative overflow-hidden`}>
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="relative flex-1" ref={searchRef}>
                <div className="relative">
                  <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 ${themeClasses.mutedText} transition-colors z-10`} />
                  <input
                    type="text"
                    placeholder="Search by name, description, tags, or category..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    className={`w-full pl-14 pr-6 py-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 backdrop-blur-sm shadow-lg text-lg`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                      }}
                      className={`absolute right-5 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedText} hover:${themeClasses.text} transition-colors`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Enhanced Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className={`absolute top-full left-0 right-0 mt-4 ${themeClasses.cardBg} border ${themeClasses.cardBorder} rounded-2xl shadow-2xl z-50 backdrop-blur-md overflow-hidden`}
                  >
                    <div className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${themeClasses.mutedText} border-b ${themeClasses.cardBorder} ${isDarkTheme ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-50'}`}>
                      Search Suggestions
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-5 py-4 cursor-pointer hover:${isDarkTheme ? 'bg-gray-800' : 'bg-blue-50'} transition-all duration-150 flex items-center gap-4 ${index === searchSuggestions.length - 1 ? '' : `border-b ${themeClasses.cardBorder} border-opacity-30`} group`}
                      >
                        <Search className={`h-4 w-4 ${themeClasses.mutedText} group-hover:text-blue-500 flex-shrink-0 transition-colors`} />
                        <span className={`${themeClasses.text} truncate font-medium text-base group-hover:text-blue-500 transition-colors`}>
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative lg:w-80">
                <Filter className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 ${themeClasses.mutedText} z-10`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none w-full pl-14 pr-12 py-4 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-lg text-lg font-medium`}
                >
                  {categories.map(category => (
                    <option key={category} value={category} className={`${themeClasses.inputBg} ${themeClasses.inputText} py-2`}>
                      {category === 'All' ? '🌟 All Categories' : `📁 ${category}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeClasses.mutedText} pointer-events-none`} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Summary */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className={`text-4xl font-black ${themeClasses.text} mb-3 tracking-tight`}>
                {filteredTools.length === 0 && searchTerm ? 'No Results' : 
                 `${filteredTools.length} ${filteredTools.length === 1 ? 'Tool' : 'Tools'} Found`}
              </h2>
              <p className={`${themeClasses.secondaryText} text-lg flex items-center gap-2`}>
                {selectedCategory !== 'All' && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-sm font-medium`}>
                    📁 {selectedCategory}
                  </span>
                )}
                {searchTerm && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-sm font-medium`}>
                    🔍 "{searchTerm}"
                  </span>
                )}
                {!searchTerm && selectedCategory === 'All' && 'Explore all available AI tools'}
              </p>
            </div>
            
            <div className={`hidden sm:flex items-center gap-4 ${themeClasses.secondaryText}`}>
              <div className="flex items-center gap-2">
                <Grid className="h-6 w-6" />
                <span className="font-semibold">Grid View</span>
              </div>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setShowSuggestions(false);
                  }}
                  className={`${themeClasses.secondaryButton} px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2`}
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-24">
            <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-3xl p-16 max-w-lg mx-auto border ${themeClasses.cardBorder} shadow-2xl relative overflow-hidden`}>
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className={`w-24 h-24 mx-auto mb-8 rounded-full ${themeClasses.tagBg} flex items-center justify-center border-4 ${themeClasses.cardBorder}`}>
                <Search className={`h-12 w-12 ${themeClasses.mutedText}`} />
              </div>
              
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                {searchTerm ? 'No Matching Tools Found' : 'No Tools Available'}
              </h3>
              
              <p className={`${themeClasses.secondaryText} mb-8 text-lg leading-relaxed`}>
                {searchTerm 
                  ? `We couldn't find any tools matching "${searchTerm}". Try adjusting your search terms or filters.`
                  : 'Be the first to add an amazing AI tool to our library!'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setShowSuggestions(false);
                    }}
                    className={`${themeClasses.button} px-8 py-3 rounded-full transition-all duration-300 font-semibold transform hover:scale-105`}
                  >
                    View All Tools
                  </button>
                )}
                <button
                  onClick={() => setShowForm(true)}
                  className={`${themeClasses.secondaryButton} px-8 py-3 rounded-full transition-all duration-300 font-semibold transform hover:scale-105 flex items-center gap-2 justify-center`}
                >
                  <Plus className="h-5 w-5" />
                  Add New Tool
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                ref={el => toolCardsRef.current[index] = el}
                className={`relative ${themeClasses.cardBg} backdrop-blur-md rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border ${themeClasses.cardBorder} group transform hover:-translate-y-2 opacity-0 translate-y-8 hover:scale-105`}
                style={{
                  boxShadow: isDarkTheme
                    ? '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    : '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Card accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className={`text-2xl font-bold ${themeClasses.text} group-hover:text-blue-500 transition-colors duration-300 leading-tight`}>
                      {tool.name}
                    </h3>
                    <Sparkles className={`h-6 w-6 ${themeClasses.mutedText} group-hover:text-purple-500 transition-colors duration-300 flex-shrink-0 ml-2`} />
                  </div>
                  
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold ${themeClasses.tagBg} ${themeClasses.tagText} rounded-full border ${themeClasses.tagBorder} shadow-sm`}>
                    📁 {tool.category}
                  </span>
                </div>

                <p className={`${themeClasses.secondaryText} mb-8 line-clamp-4 text-base leading-relaxed`}>
                  {tool.description}
                </p>

                {tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tool.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className={`${themeClasses.tagBg} ${themeClasses.tagText} text-sm px-3 py-1.5 rounded-full border ${themeClasses.tagBorder} font-medium transition-all duration-200 hover:scale-105`}
                      >
                        {tag}
                      </span>
                    ))}
                    {tool.tags.length > 4 && (
                      <span className={`${themeClasses.tagBg} ${themeClasses.mutedText} text-sm px-3 py-1.5 rounded-full border ${themeClasses.tagBorder} font-medium`}>
                        +{tool.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {tool.pricing && (
                  <div className={`mb-8 p-4 rounded-xl ${isDarkTheme ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60' : 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80'} border ${themeClasses.cardBorder} backdrop-blur-sm`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span className={`text-sm font-semibold ${themeClasses.text}`}>{tool.pricing}</span>
                    </div>
                  </div>
                )}

                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-3 ${themeClasses.button} px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-base w-full group-hover:shadow-xl transform group-hover:scale-105`}
                >
                  <span>Explore Tool</span>
                  <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>

                {tool.notes && (
                  <div className={`mt-4 p-3 rounded-lg ${isDarkTheme ? 'bg-gray-800/40' : 'bg-gray-50/80'} border ${themeClasses.cardBorder}`}>
                    <p className={`text-sm ${themeClasses.mutedText} italic`}>
                      💡 {tool.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-8px) translateX(4px) rotate(1deg); }
          50% { transform: translateY(0px) translateX(-4px) rotate(-0.5deg); }
          75% { transform: translateY(8px) translateX(3px) rotate(0.5deg); }
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDarkTheme ? '#1f2937' : '#f1f5f9'};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDarkTheme ? '#4b5563' : '#cbd5e1'};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkTheme ? '#6b7280' : '#94a3b8'};
        }

        /* Enhanced focus styles */
        input:focus, textarea:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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