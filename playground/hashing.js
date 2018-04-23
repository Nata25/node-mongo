const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 10,
};

const token = jwt.sign(data, '123');
console.log('token', token);

const decoded = jwt.verify(token, '123');
console.log('decoded', decoded);


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
