const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb+srv://himanshu:Singh9995@cluster0.e0pwwco.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to DB');
    
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
