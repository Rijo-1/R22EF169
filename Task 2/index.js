const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 9876;

// Configuration
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
const TEST_API_BASE_URL = 'http://localhost:9876/numbers'; // Replace with actual test server URL

// Store for numbers
class NumberStore {
  constructor(windowSize) {
    this.windowSize = windowSize;
    this.numbers = [];
  }

  addNumber(num) {
    // Check if number already exists
    if (!this.numbers.includes(num)) {
      if (this.numbers.length >= this.windowSize) {
        // Remove oldest number
        this.numbers.shift();
      }
      this.numbers.push(num);
    }
  }

  getNumbers() {
    return [...this.numbers];
  }

  getAverage() {
    if (this.numbers.length === 0) return 0;
    const sum = this.numbers.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / this.numbers.length).toFixed(2));
  }
}

const numberStore = new NumberStore(WINDOW_SIZE);

// Fetch numbers with timeout
async function fetchNumbersWithTimeout(type) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${TEST_API_BASE_URL}/numbers/${type}`, {
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.numbers || [];
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request timed out');
    } else {
      console.error('Error fetching numbers:', error);
    }
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// API endpoint
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;
  const validTypes = ['p', 'f', 'e', 'r'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid number type' });
  }

  const prevState = numberStore.getNumbers();
  
  try {
    const fetchedNumbers = await fetchNumbersWithTimeout(type);
    
    // Add new numbers to store
    fetchedNumbers.forEach(num => numberStore.addNumber(num));
    
    const response = {
      windowPrevState: prevState,
      windowCurrState: numberStore.getNumbers(),
      numbers: fetchedNumbers,
      avg: numberStore.getAverage()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Average Calculator service running on http://localhost:${port}`);
});