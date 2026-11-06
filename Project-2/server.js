
const express = require('express');

const app = express();
const PORT = 3000;

// JSON format mein user ka data receive karne ke liye
app.use(express.json());

// GET API endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome! Backend API is working.'
  });
});

// POST API endpoint
app.post('/user', (req, res) => {
  const { name, email } = req.body;

  // Name validation
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Name is required.'
    });
  }

  // Email validation
  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      error: 'Email is required.'
    });
  }

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      error: 'Please enter a valid email address.'
    });
  }

  // Successful response
  res.status(201).json({
    message: 'User received successfully!',
    user: {
      name: name.trim(),
      email: email.trim()
    }
  });
});

// Unknown route handling
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found.'
  });
});

// Server start karna
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
