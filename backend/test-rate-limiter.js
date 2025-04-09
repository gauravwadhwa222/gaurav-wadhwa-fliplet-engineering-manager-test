const express = require('express');
const rateLimiter = require('./rate-limiter');

const app = express();
app.use(rateLimiter);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Request successful' });
});

// Function to simulate requests
async function simulateRequests(tenantId, numRequests, delay = 0) {
  console.log(`\nSimulating ${numRequests} requests for tenant ${tenantId}...`);
  let successCount = 0;
  let rateLimitedCount = 0;
  
  for (let i = 1; i <= numRequests; i++) {
    try {
      const response = await fetch('http://localhost:3000/test', {
        headers: { 'x-tenant-id': tenantId }
      });
      
      const data = await response.json();
      if (response.status === 200) {
        successCount++;
        if (i === 1 || i === numRequests || i % 20 === 0) {
          console.log(`Request ${i}/${numRequests}:`);
          console.log(`- Status: ${response.status}`);
          console.log(`- Remaining: ${response.headers.get('X-RateLimit-Remaining')}`);
          console.log(`- Response: ${JSON.stringify(data)}`);
        }
      } else {
        rateLimitedCount++;
        if (rateLimitedCount <= 3) { // Show only first 3 rate limit errors
          console.log(`Request ${i}/${numRequests}:`);
          console.log(`- Status: ${response.status}`);
          console.log(`- Response: ${JSON.stringify(data)}`);
        }
      }
      
      if (delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Error in request ${i}:`, error.message);
    }
  }
  console.log(`\nSummary for tenant ${tenantId}:`);
  console.log(`- Successful requests: ${successCount}`);
  console.log(`- Rate limited requests: ${rateLimitedCount}`);
}

// Function to simulate concurrent requests
async function simulateConcurrentRequests(tenantId, numRequests) {
  console.log(`\nSimulating ${numRequests} concurrent requests for tenant ${tenantId}...`);
  
  const requests = Array(numRequests).fill().map(async (_, i) => {
    try {
      const response = await fetch('http://localhost:3000/test', {
        headers: { 'x-tenant-id': tenantId }
      });
      
      const data = await response.json();
      return {
        requestNum: i + 1,
        status: response.status,
        remaining: response.headers.get('X-RateLimit-Remaining'),
        data
      };
    } catch (error) {
      return {
        requestNum: i + 1,
        error: error.message
      };
    }
  });
  
  const results = await Promise.all(requests);
  let successCount = 0;
  let rateLimitedCount = 0;
  
  results.forEach(result => {
    if (result.error) {
      console.log(`Request ${result.requestNum}/${numRequests}: Error - ${result.error}`);
    } else {
      if (result.status === 200) {
        successCount++;
        if (result.requestNum === 1 || result.requestNum === numRequests || result.requestNum % 20 === 0) {
          console.log(`Request ${result.requestNum}/${numRequests}:`);
          console.log(`- Status: ${result.status}`);
          console.log(`- Remaining: ${result.remaining}`);
        }
      } else {
        rateLimitedCount++;
        if (rateLimitedCount <= 3) { // Show only first 3 rate limit errors
          console.log(`Request ${result.requestNum}/${numRequests}:`);
          console.log(`- Status: ${result.status}`);
          console.log(`- Response: ${JSON.stringify(result.data)}`);
        }
      }
    }
  });
  
  console.log(`\nSummary for tenant ${tenantId}:`);
  console.log(`- Successful requests: ${successCount}`);
  console.log(`- Rate limited requests: ${rateLimitedCount}`);
}

// Function to test sliding window behavior
async function testSlidingWindow(tenantId, requestsPerBatch, numBatches, delayBetweenBatches) {
  console.log(`\nTesting sliding window behavior for tenant ${tenantId}...`);
  console.log(`Sending ${requestsPerBatch} requests every ${delayBetweenBatches}ms for ${numBatches} batches`);
  
  for (let batch = 1; batch <= numBatches; batch++) {
    console.log(`\nBatch ${batch}/${numBatches}:`);
    await simulateConcurrentRequests(tenantId, requestsPerBatch);
    if (batch < numBatches) {
      console.log(`Waiting ${delayBetweenBatches}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }
}

// Start the server
const server = app.listen(3000, async () => {
  console.log('Server started on port 3000\n');
  
  try {
    // Import fetch dynamically
    const fetch = (await import('node-fetch')).default;
    global.fetch = fetch;

    // Test 1: Basic rate limiting (5 requests)
    console.log('=== Test 1: Basic Rate Limiting ===');
    await simulateRequests('tenant1', 5);
    
    // Test 2: Rate limit exceeded (105 requests)
    console.log('\n=== Test 2: Rate Limit Exceeded ===');
    await simulateRequests('tenant2', 105);
    
    // Test 3: Different tenants
    console.log('\n=== Test 3: Different Tenants ===');
    await simulateRequests('tenant3', 5);
    
    // Test 4: Missing tenant ID
    console.log('\n=== Test 4: Missing Tenant ID ===');
    const response = await fetch('http://localhost:3000/test');
    const data = await response.json();
    console.log('Response:', data);
    
    // Test 5: Concurrent requests (50 simultaneous requests)
    console.log('\n=== Test 5: Concurrent Requests ===');
    await simulateConcurrentRequests('tenant4', 50);
    
    // Test 6: Sliding window behavior
    console.log('\n=== Test 6: Sliding Window Behavior ===');
    // Send 40 requests every 20 seconds for 3 batches
    await testSlidingWindow('tenant5', 40, 3, 20000);
    
    // Test 7: Burst handling (rapid concurrent requests)
    console.log('\n=== Test 7: Burst Handling ===');
    // Send two bursts of 60 requests with a small delay
    console.log('\nFirst burst:');
    await simulateConcurrentRequests('tenant6', 60);
    console.log('\nWaiting 1 second...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\nSecond burst:');
    await simulateConcurrentRequests('tenant6', 60);
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    server.close();
  }
}); 