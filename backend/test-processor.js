const processUsers = require('./data-processor');

// Generate a large test dataset
function generateTestData(size) {
  const users = [];
  for (let i = 1; i <= size; i++) {
    // Create some duplicates
    const isDuplicate = i % 3 === 0;
    const baseId = isDuplicate ? i - 2 : i;
    
    users.push({
      id: i,
      name: `User${baseId}`,
      email: isDuplicate ? `user${baseId}@email.com` : (i % 5 === 0 ? null : `user${i}@email.com`)
    });
  }
  return users;
}

async function runTest() {
  console.log('Starting performance test...');
  
  // Test with different dataset sizes
  const testSizes = [10, 100, 1000];
  
  for (const size of testSizes) {
    console.log(`\nTesting with ${size} users...`);
    const testUsers = generateTestData(size);
    
    // Measure execution time
    const startTime = process.hrtime();
    const result = await processUsers(testUsers);
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTime = seconds + nanoseconds / 1e9;
    
    // Log results
    console.log(`Execution time: ${executionTime.toFixed(3)} seconds`);
    console.log(`Input size: ${testUsers.length} users`);
    console.log(`Output size: ${result.length} users (after deduplication)`);
    console.log(`Users with missing emails: ${testUsers.filter(u => !u.email).length}`);
    console.log(`Users with enriched emails: ${result.filter(u => u.email.startsWith('user') && u.email.endsWith('@email.com')).length}`);
    
    // Verify deduplication
    const uniqueEmails = new Set(result.map(u => u.email));
    console.log(`Unique emails in result: ${uniqueEmails.size}`);
    
    // Sample output
    console.log('\nSample of processed users:');
    console.log(result.slice(0, 3));
  }
}

// Run the test
runTest().catch(console.error); 