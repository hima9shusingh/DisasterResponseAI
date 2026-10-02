import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import generateToken from './src/utils/generateToken.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  
  const roles = ['citizen', 'government', 'admin', 'volunteer', 'ngo'];
  
  for (const role of roles) {
    const email = `${role}@test.com`;
    let user = await User.findOne({ email });
    
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('password123', salt);
      user = await User.create({
        name: `Test ${role}`,
        email,
        password,
        phone: '1234567890',
        role
      });
      console.log(`Created user ${email}`);
    } else {
      console.log(`User ${email} already exists`);
    }
    
    const token = generateToken(user._id, user.role);
    console.log(`Token for ${role}: ${token}\n`);
  }
  
  process.exit();
};

seed().catch(console.error);
