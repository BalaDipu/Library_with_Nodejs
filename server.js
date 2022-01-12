const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

//always put before all code to be executed
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception..Shutting Down.....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const Database = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(Database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => console.log('Database connection in progress'));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandle Rejection..Shutting Down.....');
  // we can call just process.exit(1)....but it immediately reject the program without handle the rest of api call.
  // So we need to shut down the database first then we exit the program
  server.close(() => {
    process.exit(1);
  });
});

