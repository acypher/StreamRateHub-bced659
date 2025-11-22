import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testSearch() {
  console.log('========================================');
  console.log('Testing Search API with "The Contender"');
  console.log('========================================\n');

  try {
    console.log('Searching for "The Contender"...\n');

    const response = await axios.post(`${BASE_URL}/api/search`, {
      query: 'The Contender'
    });

    console.log('✅ Search successful!\n');
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n========================================');
    console.log('Expected ratings:');
    console.log('  Rotten Tomatoes: 76% Tomatometer, 73% Popcornmeter');
    console.log('  Metacritic: 59 Metascore');
    console.log('========================================');
  } catch (error) {
    console.error('❌ Search failed!\n');
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Error:', err.response?.data || err.message);
    console.log('\n========================================');
    console.log('Test failed!');
    console.log('========================================');
    process.exit(1);
  }
}

testSearch();
