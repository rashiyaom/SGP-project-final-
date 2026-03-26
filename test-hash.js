const bcrypt = require('bcryptjs');

const password = 'admin@omkar123';

(async () => {
  // Hash the password
  const hash1 = await bcrypt.hash(password, 10);
  console.log('Hash 1:', hash1);
  
  // Try to compare
  const match1 = await bcrypt.compare(password, hash1);
  console.log('Match 1:', match1);
  
  // Create another hash
  const hash2 = await bcrypt.hash(password, 10);
  console.log('Hash 2:', hash2);
  
  // Compare first password with second hash
  const match2 = await bcrypt.compare(password, hash2);
  console.log('Match 2:', match2);
})();
