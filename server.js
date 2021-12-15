const mongoose =require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

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

const port = process.env.PORT||4000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandle Rejection..Shutting Down.....');
    server.close(() => {
      process.exit(1);
    });
  });
  
