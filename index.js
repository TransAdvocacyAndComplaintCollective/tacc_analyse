// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import documentRouter from './routes/documentRouter.js';
import filesystemRouter from './routes/filesystemRouter.js';

// __dirname is not defined in ES modules, so we create it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the React app
app.use(express.static('client/build'));

// API routes
app.use('/api/documents', documentRouter);
app.use('/api/fs', filesystemRouter);
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Catch-all for non-API routes: only serve React's index.html if the URL does not start with "/api"
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    // If the API route is not handled above, send a 404 JSON response
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
