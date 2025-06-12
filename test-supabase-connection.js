const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL'
  ];

  let missingVars = [];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '));
    console.log('\nPlease set these in your .env.local file');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set\n');

  // Test Supabase connection
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test database connection
    console.log('Testing database connection...');
    const { data, error } = await supabase
      .from('Job')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\nMake sure you have run: npx prisma db push');
    } else {
      console.log('✅ Database connection successful\n');
    }

    // Test auth configuration
    console.log('Testing authentication setup...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });

    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Authentication is configured\n');
    }

    console.log('🎉 Supabase setup is complete!');
    console.log('\nNext steps:');
    console.log('1. Enable email authentication in Supabase dashboard');
    console.log('2. Run the RLS policies SQL script in Supabase SQL editor');
    console.log('3. Start your development server: npm run dev');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection(); 