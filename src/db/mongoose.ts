import { connect } from 'mongoose';

/*
connect('mongodb://127.0.0.1:27017/dsikea-api-rest')
  .then(() => {
    console.log('Connection to MongoDB server established');
  })
  .catch(() => {
    console.log('Unable to connect to MongoDB server');
  });
*/

try {
  await connect(process.env.MONGODB_URL!);
  console.log('Connection to MongoDB server established');
} catch (error) {
  console.log(error);
}