// Sample dataset (users.json)
const users = [
  { id: 1, name: "Alice", email: "alice@email.com" },
  { id: 2, name: "Bob", email: null },
  { id: 3, name: "Alice", email: "alice@email.com" },
];

// Mock API to fetch missing data
async function fetchUserData(id) {
  return { email: `user${id}@email.com` };
}

// Optimize this function:
async function processUsers(users) {
  // Step 1: Deduplicate users by creating a map with email as key
  const uniqueUsers = new Map();
  
  // Step 2: Identify users needing data enrichment
  const usersNeedingEnrichment = [];
  
  for (const user of users) {
    const key = user.email || `id-${user.id}`;
    
    // Only store the first occurrence of a user (by email)
    if (!uniqueUsers.has(key) || !user.email) {
      uniqueUsers.set(key, { ...user });
      
      // Add users with missing emails to enrichment queue
      if (!user.email) {
        usersNeedingEnrichment.push(user.id);
      }
    }
  }
  
  // Step 3: Fetch missing data in parallel batches
  const BATCH_SIZE = 100; // Adjust based on API constraints
  for (let i = 0; i < usersNeedingEnrichment.length; i += BATCH_SIZE) {
    const batch = usersNeedingEnrichment.slice(i, i + BATCH_SIZE);
    const enrichmentPromises = batch.map(id => fetchUserData(id));
    
    // Wait for current batch to complete
    const enrichedData = await Promise.all(enrichmentPromises);
    
    // Update user records with enriched data
    for (let j = 0; j < batch.length; j++) {
      const userId = batch[j];
      const userKey = `id-${userId}`;
      const user = uniqueUsers.get(userKey);
      
      if (user) {
        user.email = enrichedData[j].email;
        // Update the map with the email key instead of the id key
        uniqueUsers.delete(userKey);
        uniqueUsers.set(enrichedData[j].email, user);
      }
    }
  }
  
  // Step 4: Return the deduplicated and enriched user list
  return Array.from(uniqueUsers.values());
}

module.exports = processUsers;