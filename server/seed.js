import 'dotenv/config';
import mongoose from 'mongoose';
import { ensureSeed, resetProducts, ADMIN_EMAIL, ADMIN_PASSWORD } from './seedData.js';

// Manual reseed (WIPES products). Only needed if you want to reset the catalogue.
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/threadhaus');
await resetProducts();
await ensureSeed();
console.log(`Products reset. Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
await mongoose.disconnect();
