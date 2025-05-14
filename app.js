const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Path where the secret will be mounted
const secretPath = process.env.SECRET_PATH || '/mnt/secrets/credentials';

// Endpoint to get messages
app.get('/api/messages', (req, res) => {
  try {
    // Read the secret from the file
    let secret = "Secret file not found";
    if (fs.existsSync(secretPath)) {
      secret = fs.readFileSync(secretPath, 'utf8');
    }
    
    // Return data and masked secret
    res.json({
      messages: [
        { id: 1, text: "Hello from the backend!" },
        { id: 2, text: "This is a test message" }
      ],
      secretStatus: secret ? "Secret was loaded successfully" : "No secret found",
      secretFirstChars: secret ? secret.substring(0, 3) + "..." : "N/A" // Just show first few chars for security
    });
  } catch (error) {
    console.error("Error reading secret:", error);
    res.status(500).json({ error: "Failed to process request", details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend service running on port ${port}`);
});
