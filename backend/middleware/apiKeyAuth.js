const User = require('../models/user.model');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API Key missing. Add x-api-key header.' });
  }

  try {
    const user = await User.findOne({ apiKey });
    console.log('Received key:', apiKey);  
    console.log('Found user:', user);  
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid API Key.' });
    }

    req.userId = user._id;
    req.apiKey = user.apiKey;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

module.exports = apiKeyAuth;