import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import { ensureSeed } from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Serve the built React app in production (single deployment)
const dist = path.join(__dirname, '../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// No MONGO_URI set -> start a temporary in-memory MongoDB (nothing to install or configure).
async function getMongoUri() {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  console.log('No MONGO_URI found: using a temporary database (data resets when you stop the app).');
  return mem.getUri('threadhaus');
}

const PORT = process.env.PORT || 5000;
try {
  await mongoose.connect(await getMongoUri());
  await ensureSeed();
  app.listen(PORT, () => console.log(`ThreadHaus API running on http://localhost:${PORT}`));
} catch (err) {
  console.error('Startup failed:', err.message);
  process.exit(1);
}
