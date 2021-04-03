const mongoose = require("mongoose");
const dbConfig = require("../../config/dbConfig.json");

const initDB = () => {
  mongoose.connect(dbConfig.url, {
    // dbName: dbConfig.url,
    // user: dbConfig.username,
    // pass: dbConfig.password,
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