import { Document, connect, model, Schema } from "mongoose";
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/furnitures').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});



