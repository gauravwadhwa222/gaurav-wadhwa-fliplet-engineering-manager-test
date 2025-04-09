// Using sliding window algorithm for rate limiting
const rateLimits = new Map(); // Using Map instead of plain object for better performance

/**
 * Rate limiter middleware using sliding window algorithm
 * Allows 100 requests per minute per tenant
 */
function rateLimiter(req, res, next) {
  const tenant = req.headers["x-tenant-id"];
  const now = Date.now();
  const WINDOW_SIZE_MS = 60 * 1000; // 1 minute in milliseconds
  const MAX_REQUESTS = 100;
  
  if (!tenant) {
    return res.status(400).json({ 
      error: "Missing tenant ID", 
      message: "Please provide a valid tenant ID in the x-tenant-id header" 
    });
  }

  // Initialize or get the tenant's request history
  if (!rateLimits.has(tenant)) {
    rateLimits.set(tenant, []);
  }
  
  const requests = rateLimits.get(tenant);
  
  // Remove requests outside the current time window
  const validRequests = requests.filter(timestamp => now - timestamp < WINDOW_SIZE_MS);
  
  // Update the requests array with valid requests
  rateLimits.set(tenant, validRequests);
  
  // Check if rate limit is exceeded
  if (validRequests.length >= MAX_REQUESTS) {
    const oldestRequest = Math.min(...validRequests);
    const resetTime = oldestRequest + WINDOW_SIZE_MS;
    const retryAfterSeconds = Math.ceil((resetTime - now) / 1000);
    
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: `Rate limit of ${MAX_REQUESTS} requests per minute exceeded for tenant ${tenant}`,
      retryAfter: retryAfterSeconds
    });
  }
  
  // Add current request timestamp
  validRequests.push(now);
  rateLimits.set(tenant, validRequests);
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS,
    'X-RateLimit-Remaining': MAX_REQUESTS - validRequests.length,
    'X-RateLimit-Reset': Math.ceil((now + WINDOW_SIZE_MS) / 1000)
  });
  
  next();
}

module.exports = rateLimiter;