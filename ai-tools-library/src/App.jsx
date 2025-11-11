import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, Filter, Plus, ExternalLink, X, Moon, Sun, ChevronDown, Info, AlertCircle } from 'lucide-react';
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

  const toolCardsRef = useRef([]);

  const themeClasses = {
    background: isDarkTheme ? 'bg-black' : 'bg-gray-50',
    text: isDarkTheme ? 'text-white' : 'text-gray-900',
    cardBg: isDarkTheme ? 'bg-gray-900' : 'bg-white',
    cardBorder: isDarkTheme ? 'border-gray-800' : 'border-gray-200',
    inputBg: isDarkTheme ? 'bg-gray-800' : 'bg-white',
    inputBorder: isDarkTheme ? 'border-gray-700' : 'border-gray-300',
    inputText: isDarkTheme ? 'text-white' : 'text-gray-900',
    secondaryText: isDarkTheme ? 'text-gray-300' : 'text-gray-600',
    mutedText: isDarkTheme ? 'text-gray-400' : 'text-gray-500',
    button: isDarkTheme ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900',
    secondaryButton: isDarkTheme ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300',
    tagBg: isDarkTheme ? 'bg-gray-800' : 'bg-gray-100',
    tagText: isDarkTheme ? 'text-gray-200' : 'text-gray-700',
    tagBorder: isDarkTheme ? 'border-gray-700' : 'border-gray-300',
    warningBg: isDarkTheme ? 'bg-yellow-900/20' : 'bg-yellow-50',
    warningBorder: isDarkTheme ? 'border-yellow-600/40' : 'border-yellow-200',
    warningText: isDarkTheme ? 'text-yellow-300' : 'text-yellow-700',
    errorBg: isDarkTheme ? 'bg-red-900/20' : 'bg-red-50',
    errorBorder: isDarkTheme ? 'border-red-600/40' : 'border-red-200',
    errorText: isDarkTheme ? 'text-red-300' : 'text-red-600'
  };

  const getLightingEffect = () => {
    return (
      <div className="absolute inset-0 fixed pointer-events-none">
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96"
          style={{
            background: isDarkTheme
              ? 'radial-gradient(ellipse at center top, rgba(255,255,255,0.03) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center top, rgba(0,0,0,0.03) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  };

  const predefinedCategories = [
    'AI App Builders',
    'AI Assistants', 
    'AI Automation',
    'APIs',
    'Data & AI',
    'Generative Media',
    'Hosting',
    'Learning',
    'Productivity',
    'Utilities',
    'Web Development',
    'Websites',
    'Writing',
    'Design',
    'Video',
    'Audio',
    'Image Generation',
    'Code Generation',
    'Research',
    'Analytics'
  ];

  const checkForDuplicates = (name, category) => {
    const duplicateName = tools.find(tool => 
      tool.name.toLowerCase() === name.toLowerCase()
    );
    
    const existingCategories = [...new Set(tools.map(tool => tool.category))];
    const duplicateCategory = existingCategories.find(cat => 
      cat.toLowerCase() === category.toLowerCase()
    );
    
    let warning = '';
    if (duplicateName) {
      warning += `⚠️ Tool "${duplicateName.name}" already exists. `;
    }
    if (duplicateCategory && duplicateCategory !== category) {
      warning += `💡 Use existing category "${duplicateCategory}" instead of "${category}".`;
    }
    
    setDuplicateWarning(warning);
  };

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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field === 'name' || field === 'category') {
      if (formData.name.trim() && formData.category.trim()) {
        checkForDuplicates(
          field === 'name' ? value : formData.name,
          field === 'category' ? value : formData.category
        );
      }
    }
  };

  const generateSuggestions = (searchValue) => {
    if (!searchValue.trim() || searchValue.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const searchLower = searchValue.toLowerCase();
    const suggestions = new Map();

    tools.forEach(tool => {
      const name = tool.name.toLowerCase();
      if (name.includes(searchLower)) {
        suggestions.set(tool.name.toLowerCase(), tool.name);
      }

      if (tool.category.toLowerCase().includes(searchLower)) {
        suggestions.set(tool.category.toLowerCase(), tool.category);
      }

      if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchLower)) {
            suggestions.set(tag.toLowerCase(), tag);
          }
        });
      }
    });

    const sortedSuggestions = Array.from(suggestions.values())
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        
        const aExact = aLower === searchLower;
        const bExact = bLower === searchLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aStarts = aLower.startsWith(searchLower);
        const bStarts = bLower.startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return a.length - b.length;
      })
      .slice(0, 8);

    setSearchSuggestions(sortedSuggestions);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

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
      
      const existingCategories = (data || [])
        .map(tool => tool.category)
        .filter(cat => cat && cat.trim());
      
      const categoryMap = new Map();
      
      predefinedCategories.forEach(cat => {
        categoryMap.set(cat.toLowerCase(), cat);
      });
      
      existingCategories.forEach(cat => {
        const lowerCat = cat.toLowerCase();
        
        if (lowerCat === 'api' || lowerCat === 'website') {
          return;
        }
        
        if (!categoryMap.has(lowerCat)) {
          categoryMap.set(lowerCat, cat);
        }
      });

      const allCategories = ['All', ...Array.from(categoryMap.values())];
      
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

  useEffect(() => {
    let filtered = [...tools];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => {
        if (!tool.category) return false;
        
        const toolCategory = tool.category.toLowerCase();
        const selectedCategoryLower = selectedCategory.toLowerCase();
        
        if (selectedCategoryLower === 'apis') {
          return toolCategory === 'api' || toolCategory === 'apis';
        } else if (selectedCategoryLower === 'websites') {
          return toolCategory === 'website' || toolCategory === 'websites';
        } else {
          return toolCategory === selectedCategoryLower;
        }
      });
    }

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

      setFormData({
        name: '', description: '', link: '', category: '',
        tags: '', pricing: '', notes: ''
      });
      setFormErrors({});
      setDuplicateWarning('');
      setShowForm(false);

      setTimeout(fetchTools, 100);
      
    } catch (err) {
      console.error('Error adding tool:', err);
      setError(err.message);
    }
  };

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
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} ${themeClasses.text}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${isDarkTheme ? 'border-white' : 'border-black'} mx-auto mb-4`}></div>
          <p className={`text-lg ${themeClasses.secondaryText}`}>Loading AI Tools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} ${themeClasses.text}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className={`${themeClasses.cardBg} rounded-xl p-8 border ${themeClasses.cardBorder} shadow-xl`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>Something went wrong</h2>
            <p className={`${themeClasses.errorText} mb-6 p-3 rounded-lg ${themeClasses.errorBg} border ${themeClasses.errorBorder}`}>
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className={`${themeClasses.button} px-6 py-3 rounded-lg transition-colors font-medium`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      {getLightingEffect()}

      <div id="search-section" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex-1">
            <h1 className={`text-5xl font-bold ${themeClasses.text} mb-4 tracking-tight`}>
              AI Tools Library
            </h1>
            <p className={`${themeClasses.secondaryText} text-xl max-w-2xl`}>
              Discover and share the best AI tools, APIs, and resources for your projects.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className={`px-3 py-1 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-sm`}>
                {tools.length} Tools
              </span>
              <span className={`px-3 py-1 rounded-full ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-sm`}>
                {categories.length - 1} Categories
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`${themeClasses.secondaryButton} p-3 rounded-lg transition-colors`}
              aria-label="Show guidelines"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`${themeClasses.cardBg} ${themeClasses.cardBorder} border p-3 rounded-lg transition-colors shadow-sm`}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showGuidelines && (
          <div className="mb-12">
            <div className={`${themeClasses.cardBg} rounded-xl p-6 border ${themeClasses.cardBorder} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text} flex items-center gap-2`}>
                <Info className="h-5 w-5" />
                Submission Guidelines
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className={`font-medium mb-2 ${themeClasses.text}`}>Tool Names</h4>
                  <ul className={`space-y-1 ${themeClasses.secondaryText}`}>
                    <li>• Use the official tool name</li>
                    <li>• Check for existing duplicates</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-medium mb-2 ${themeClasses.text}`}>Categories</h4>
                  <ul className={`space-y-1 ${themeClasses.secondaryText}`}>
                    <li>• Use existing categories when possible</li>
                    <li>• Keep categories broad</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowGuidelines(false)}
                className={`mt-4 ${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
              >
                Got it
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${themeClasses.button} px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm`}
          >
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {showForm ? 'Cancel' : 'Add New Tool'}
          </button>
        </div>

        {showForm && (
          <div className="mb-12">
            <div className={`${themeClasses.cardBg} rounded-xl p-8 border ${themeClasses.cardBorder} shadow-lg`}>
              <h3 className={`text-xl font-semibold mb-6 ${themeClasses.text}`}>Add New Tool</h3>

              {duplicateWarning && (
                <div className={`${themeClasses.warningBg} border ${themeClasses.warningBorder} rounded-lg p-3 mb-6 flex items-start gap-2`}>
                  <AlertCircle className={`h-4 w-4 ${themeClasses.warningText} mt-0.5 flex-shrink-0`} />
                  <p className={`${themeClasses.warningText} text-sm`}>{duplicateWarning}</p>
                </div>
              )}

              <form onSubmit={handleAddTool} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                      Tool Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className={`w-full px-3 py-3 border ${formErrors.name ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                      placeholder="Enter tool name"
                      required
                    />
                    {formErrors.name && (
                      <p className={`mt-1 text-sm ${themeClasses.errorText}`}>{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className={`w-full px-3 py-3 border ${formErrors.category ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer`}
                      required
                    >
                      <option value="">Select category</option>
                      {predefinedCategories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className={`mt-1 text-sm ${themeClasses.errorText}`}>{formErrors.category}</p>
                    )}
                    
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Or enter custom category"
                        onChange={(e) => {
                          if (e.target.value.trim()) {
                            handleFormChange('category', e.target.value);
                          }
                        }}
                        className={`w-full px-3 py-2 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className={`w-full px-3 py-3 border ${formErrors.description ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none`}
                    rows="3"
                    placeholder="Describe what this tool does"
                    required
                  />
                  {formErrors.description && (
                    <p className={`mt-1 text-sm ${themeClasses.errorText}`}>{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleFormChange('link', e.target.value)}
                    className={`w-full px-3 py-3 border ${formErrors.link ? themeClasses.errorBorder : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    placeholder="https://example.com"
                    required
                  />
                  {formErrors.link && (
                    <p className={`mt-1 text-sm ${themeClasses.errorText}`}>{formErrors.link}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleFormChange('tags', e.target.value)}
                      placeholder="AI, productivity, free"
                      className={`w-full px-3 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    />
                    <p className={`text-xs ${themeClasses.mutedText} mt-1`}>
                      Separate with commas
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                      Pricing
                    </label>
                    <select
                      value={formData.pricing}
                      onChange={(e) => handleFormChange('pricing', e.target.value)}
                      className={`w-full px-3 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer`}
                    >
                      <option value="">Select pricing</option>
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Subscription">Subscription</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    className={`w-full px-3 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none`}
                    rows="2"
                    placeholder="Additional information"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className={`${themeClasses.button} px-6 py-3 rounded-lg transition-colors font-medium`}
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
                    className={`${themeClasses.secondaryButton} px-6 py-3 rounded-lg transition-colors font-medium`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className={`${themeClasses.cardBg} rounded-xl p-6 border ${themeClasses.cardBorder} shadow-sm`}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1" ref={searchRef}>
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeClasses.mutedText}`} />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                  className={`w-full pl-10 pr-4 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setShowSuggestions(false);
                    }}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedText} hover:${themeClasses.text} transition-colors`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className={`absolute top-full left-0 right-0 mt-2 ${themeClasses.cardBg} border ${themeClasses.cardBorder} rounded-lg shadow-lg z-50 overflow-hidden`}
                  >
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-4 py-3 cursor-pointer hover:${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'} transition-colors flex items-center gap-2 ${index === searchSuggestions.length - 1 ? '' : `border-b ${themeClasses.cardBorder}`}`}
                      >
                        <Search className={`h-4 w-4 ${themeClasses.mutedText}`} />
                        <span className={`${themeClasses.text} font-medium`}>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative lg:w-64">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeClasses.mutedText} z-10`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none w-full pl-10 pr-8 py-3 border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.inputText} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer font-medium`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeClasses.mutedText} pointer-events-none`} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className={`text-2xl font-semibold ${themeClasses.text} mb-2`}>
                {filteredTools.length === 0 && searchTerm ? 'No Results' : 
                 `${filteredTools.length} ${filteredTools.length === 1 ? 'Tool' : 'Tools'}`}
              </h2>
              <div className="flex items-center gap-2">
                {selectedCategory !== 'All' && (
                  <span className={`px-2 py-1 rounded ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-xs`}>
                    {selectedCategory}
                  </span>
                )}
                {searchTerm && (
                  <span className={`px-2 py-1 rounded ${themeClasses.tagBg} ${themeClasses.tagText} border ${themeClasses.tagBorder} text-xs`}>
                    "{searchTerm}"
                  </span>
                )}
              </div>
            </div>
            
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setShowSuggestions(false);
                }}
                className={`${themeClasses.secondaryButton} px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className={`${themeClasses.cardBg} rounded-xl p-12 max-w-md mx-auto border ${themeClasses.cardBorder} shadow-sm`}>
              <Search className={`h-16 w-16 ${themeClasses.mutedText} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-3`}>
                {searchTerm ? 'No Tools Found' : 'No Tools Available'}
              </h3>
              <p className={`${themeClasses.secondaryText} mb-6`}>
                {searchTerm 
                  ? `No tools match "${searchTerm}". Try different search terms.`
                  : 'Be the first to add a tool to the library!'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setShowSuggestions(false);
                    }}
                    className={`${themeClasses.button} px-6 py-3 rounded-lg transition-colors font-medium`}
                  >
                    View All Tools
                  </button>
                )}
                <button
                  onClick={() => setShowForm(true)}
                  className={`${themeClasses.secondaryButton} px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 justify-center`}
                >
                  <Plus className="h-5 w-5" />
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                ref={el => toolCardsRef.current[index] = el}
                className={`${themeClasses.cardBg} rounded-xl p-6 border ${themeClasses.cardBorder} shadow-sm hover:shadow-md transition-all duration-200 opacity-0 translate-y-4`}
              >
                <div className="mb-4">
                  <h3 className={`text-lg font-semibold ${themeClasses.text} leading-tight mb-2`}>
                    {tool.name}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium ${themeClasses.tagBg} ${themeClasses.tagText} rounded border ${themeClasses.tagBorder}`}>
                    {tool.category}
                  </span>
                </div>

                <p className={`${themeClasses.secondaryText} mb-4 text-sm leading-relaxed line-clamp-3`}>
                  {tool.description}
                </p>

                {tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className={`${themeClasses.tagBg} ${themeClasses.tagText} text-xs px-2 py-1 rounded border ${themeClasses.tagBorder}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {tool.tags.length > 3 && (
                      <span className={`${themeClasses.mutedText} text-xs px-2 py-1`}>
                        +{tool.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {tool.pricing && (
                  <div className={`mb-4 p-2 rounded ${themeClasses.tagBg} border ${themeClasses.tagBorder}`}>
                    <span className={`text-xs font-medium ${themeClasses.text}`}>{tool.pricing}</span>
                  </div>
                )}

                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 ${themeClasses.button} px-4 py-3 rounded-lg transition-colors font-medium text-sm w-full`}
                >
                  Visit Tool
                  <ExternalLink className="h-4 w-4" />
                </a>

                {tool.notes && (
                  <div className={`mt-3 p-2 rounded ${themeClasses.tagBg} border ${themeClasses.tagBorder}`}>
                    <p className={`text-xs ${themeClasses.mutedText} italic`}>
                      {tool.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
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