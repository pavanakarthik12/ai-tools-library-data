// Test Supabase connection
// Run this with: node test-supabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Make sure you have:');
  console.log('VITE_SUPABASE_URL=your_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Supabase error:', error);
      return;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Data:', data);
    console.log('📈 Total tools:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📋 Sample tool structure:');
      console.log(JSON.stringify(data[0], null, 2));
    }

  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();
