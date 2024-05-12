import { connect } from 'mongoose';


connect('mongodb://127.0.0.1:27017/dsikea-api-rest')
  .then(() => {
    console.log('Connection to MongoDB server established');
  })
  .catch(() => {
    console.log('Unable to connect to MongoDB server');
  });

  // URL de conexión a MongoDB Atlas

// const DB_URI = 'mongodb+srv://193.145.124.252:tenerife@aip-ikea-grupi.m5adqn6.mongodb.net/?retryWrites=true&w=majority&appName=aip-ikea-grupi';

// connect(DB_URI)
//   .then(() => {
//     console.log('Connection to MongoDB Atlas established');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB Atlas:', error);
//   });
