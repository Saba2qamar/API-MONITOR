const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ apiKey: { $exists: false } }).toArray();
  
  for (const user of users) {
    const newKey = 'nex_' + crypto.randomBytes(24).toString('hex');
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { apiKey: newKey } }
    );
    console.log(`Updated ${user.name}: ${newKey}`);
  }
  
  console.log('Done!');
  process.exit();
});