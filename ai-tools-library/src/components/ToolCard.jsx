import React from 'react';
import { ExternalLink, Star, Zap, DollarSign } from 'lucide-react';

const ToolCard = ({ tool }) => {
  const getPricingColor = (pricing) => {
    if (!pricing || pricing === 'N/A') return 'bg-gray-100 text-gray-600';
    const lower = pricing.toLowerCase();
    if (lower.includes('free')) return 'bg-green-100 text-green-700';
    if (lower.includes('paid') || lower.includes('$')) return 'bg-blue-100 text-blue-700';
    if (lower.includes('freemium')) return 'bg-purple-100 text-purple-700';
    return 'bg-orange-100 text-orange-700';
  };

  const getPricingIcon = (pricing) => {
    if (!pricing || pricing === 'N/A') return null;
    const lower = pricing.toLowerCase();
    if (lower.includes('free')) return <Zap className="h-3 w-3" />;
    if (lower.includes('paid') || lower.includes('$')) return <DollarSign className="h-3 w-3" />;
    if (lower.includes('freemium')) return <Star className="h-3 w-3" />;
    return <DollarSign className="h-3 w-3" />;
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Gradient overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6 z-10">
        {/* Header with title and category */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
              {tool.name}
            </h3>
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium border border-blue-200">
            {tool.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tool.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 4 && (
                <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-medium">
                  +{tool.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer with pricing and visit button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${getPricingColor(tool.pricing)}`}>
              {getPricingIcon(tool.pricing)}
              {tool.pricing || 'N/A'}
            </span>
          </div>
          
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/button inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
          >
            Visit
            <ExternalLink className="h-4 w-4 transform group-hover/button:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
    </div>
  );
};

export default ToolCard;