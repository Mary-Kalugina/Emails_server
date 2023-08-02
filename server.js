import { faker } from '@faker-js/faker';
const { faker } = require('@faker-js/faker');
const express = require('express');
const { Observable, interval } = require('rxjs');
const { map, take } = require('rxjs/operators');

const app = express();
const port = process.env.PORT || 3000;

// Generate a random message object
const generateMessage = () => ({
  id: faker.datatype.uuid(),
  from: faker.internet.email(),
  subject: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  received: Date.now() / 1000, // Convert to UNIX timestamp
});

// Generate an array of random messages
const generateMessages = (count) =>
  Array.from({ length: count }, generateMessage);

// Simulate new messages arriving every 5 seconds
const newMessage$ = interval(5000).pipe(
  map(() => ({
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000),
    messages: generateMessages(faker.datatype.number({ min: 1, max: 5 })),
  })),
  take(10) // Simulate 10 updates (remove this line for infinite updates)
);

// Endpoint to get unread messages
app.get('/messages/unread', (req, res) => {
  newMessage$.subscribe({
    next: (data) => res.json(data),
    error: (err) => res.status(500).json({ status: 'error', error: err.message }),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
