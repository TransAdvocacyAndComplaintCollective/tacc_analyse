// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import documentRouter from './routes/documentRouter.js'; // Ensure this file is compiled to JS or use ts-node

// __dirname is not defined in ES modules, so we create it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the React app
app.use(express.static('client/build'));

// API endpoint example
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Mount the document router on /api/documents
app.use('/api/documents', documentRouter);

// Catch-all handler to serve React's index.html for any other route.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
