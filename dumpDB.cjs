const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb+srv://test_user:test_password_123@cluster0.mongodb.net/adr_test?retryWrites=true&w=majority', {
      // Just to test if I can connect directly? NO, I don't have the exact DB URI. I should use HTTP to check.
    });
  } catch (err) {}
})();
