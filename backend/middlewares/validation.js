// Validation middleware for text generation
const validateGenerateText = (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      success: false,
      error: "Valid prompt is required",
      details: "Prompt must be a non-empty string",
    });
  }

  if (prompt.length > 4000) {
    return res.status(400).json({
      success: false,
      error: "Prompt too long",
      details: "Prompt must be less than 4000 characters",
    });
  }

  next();
};

// Validation middleware for chat
const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      error: "Valid message is required",
      details: "Message must be a non-empty string",
    });
  }

  if (message.length > 4000) {
    return res.status(400).json({
      success: false,
      error: "Message too long",
      details: "Message must be less than 4000 characters",
    });
  }

  next();
};

// Rate limiting middleware (basic implementation)
const rateLimiter = (req, res, next) => {
  // In production, use redis or database for rate limiting
  // This is a simple in-memory implementation
  const clientIp = req.ip;
  const now = Date.now();

  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }

  const clientRequests = global.rateLimitStore.get(clientIp) || [];
  const recentRequests = clientRequests.filter((time) => now - time < 60000); // Last minute

  if (recentRequests.length >= 10) {
    // 10 requests per minute
    return res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      details: "Maximum 10 requests per minute allowed",
    });
  }

  recentRequests.push(now);
  global.rateLimitStore.set(clientIp, recentRequests);

  next();
};

module.exports = {
  validateGenerateText,
  validateChatMessage,
  rateLimiter,
};
