const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (error, hash) => {
    console.log(hash);
  });
});

const hashedPassword = '$2a$10$mbFhqwlA8BOO4e31ExT0sei5xeTAP0eMIL2A2yKSxZ.SBvz47G/Oi';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// const data = {
//   id: 10,
// };

// const token = jwt.sign(data, '123');
// console.log('token', token);

// const decoded = jwt.verify(token, '123');
// console.log('decoded', decoded);


// let message = 'I am a user';
// let hash = SHA256(message).toString();

// console.log(hash);

// const data = {
//   id: 4
// }

// const token = {
//   data, 
//   hash: SHA256(JSON.stringify(data) + 'salting').toString()
// }

// token.data.id = 4;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'salting').toString();
// if (resultHash === token.hash) {
//   console.log('OK!');
// } else {
//   console.log('Watch out! Account is propably hacked!');
// }
