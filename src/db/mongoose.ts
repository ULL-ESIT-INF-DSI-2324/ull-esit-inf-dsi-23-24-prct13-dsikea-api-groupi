import { connect } from 'mongoose';


/**
 * @brief Connect to the database using the MONGODB_URL environment variable
 * @param process.env.MONGODB_URL! The URL of the database
 * 
 */
connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Something went wrong when conecting to the database");
    process.exit(-1);
  });
  
/*
connect('mongodb://127.0.0.1:27017/dsikea-api-rest')
  .then(() => {
    console.log('Connection to MongoDB server established');
  })
  .catch(() => {
    console.log('Unable to connect to MongoDB server');
  });
*/