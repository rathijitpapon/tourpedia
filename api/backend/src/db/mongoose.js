const mongoose = require("mongoose");

const initDB = () => {
  mongoose.connect(process.env.db_url, {
    // dbName: process.env.db_url,
    // user: process.env.db_username,
    // pass: process.env.db_password,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Database connected!!!');
  })
  .catch(error => console.log(error.message));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database!!!');
  });

  mongoose.connection.on('error', error => {
    console.log(error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected!!!');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose connection is disconnected due to app termination!!!'
      );
      process.exit(0);
    });
  });
}

module.exports = initDB;