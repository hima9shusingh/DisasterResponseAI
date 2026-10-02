require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Hardcode string requirement to avoid any require issues in script
    const collection = mongoose.connection.collection('users');
    const result = await collection.updateOne(
      { email: 'admin@adr.com' },
      { $set: { role: 'admin' } }
    );
    
    console.log(`Promoted admin: ${result.modifiedCount} modified.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
