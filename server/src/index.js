import app from './app.js';
import { connectDB } from './config/db.js';
import { Hotel } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    // Check if database is empty and seed if needed
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      console.log('Database is empty, seeding data...');
      const { default: seed } = await import('./seed.js');
      await seed();
      console.log('Database seeded successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
