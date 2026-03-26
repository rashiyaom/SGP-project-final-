const bcrypt = require('bcryptjs');

// Test comparing plain text password with bcrypt hash
const plainPassword = 'testpassword123';
const hashedPassword = '$2a$10$somehashedpassword';  // This is not a real hash

// This should work fine - it will just return false for invalid hashes
bcrypt.compare(plainPassword, hashedPassword)
  .then(result => console.log('Comparison result:', result))
  .catch(err => console.error('Error:', err.message));

// But what if the stored password is plain text?
// bcrypt.compare should fail gracefully
bcrypt.compare(plainPassword, plainPassword)
  .then(result => console.log('Plain text comparison result:', result))
  .catch(err => console.error('Error comparing plain text:', err.message));
