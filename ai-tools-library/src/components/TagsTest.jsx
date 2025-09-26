import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TagsTest = () => {
  useEffect(() => {
    const testTags = async () => {
      try {
        console.log('🔍 Testing tags fetch from Supabase...');
        
        const { data, error } = await supabase
          .from('tools')
          .select('id, name, tags')
          .limit(5);

        if (error) {
          console.error('❌ Supabase error:', error);
          return;
        }

        console.log('✅ Tags fetched successfully!');
        console.log('📊 Total tools fetched:', data?.length || 0);
        
        if (data && data.length > 0) {
          data.forEach((tool, index) => {
            console.log(`\n📋 Tool ${index + 1}:`);
            console.log(`  Name: ${tool.name}`);
            console.log(`  Tags:`, tool.tags);
            console.log(`  Tags type:`, typeof tool.tags);
            console.log(`  Is array:`, Array.isArray(tool.tags));
            console.log(`  Tags length:`, tool.tags ? tool.tags.length : 'null/undefined');
            
            if (tool.tags && Array.isArray(tool.tags)) {
              console.log(`  Tags content:`, tool.tags);
              console.log(`  First tag:`, tool.tags[0] || 'empty array');
            }
          });
        } else {
          console.log('⚠️ No tools found in database');
        }
        
      } catch (err) {
        console.error('❌ Test failed:', err);
      }
    };

    testTags();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tags Test Component</h2>
        <p className="text-gray-600 mb-4">
          This component fetches 5 tools from Supabase and logs their tags to the console.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Check the browser console for:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Tool names and their tags arrays</li>
            <li>• Whether tags are arrays or strings</li>
            <li>• Array length and content</li>
            <li>• Any fetch errors</li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Open Developer Tools (F12) → Console tab to see the results.
        </p>
      </div>
    </div>
  );
};

export default TagsTest;
