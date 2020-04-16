const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(process.env);

// SERVER START
const port = 9033 || process.env.PORT;
const server=app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

//*Prod Database Connection //*
// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

const DB=process.env.DATABASE_LOCAL;
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DB connection Successfull');
    });

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('UNHANDLE rejection Shutting DOWN');
    server.close(()=>{
        process.exit(1);
    })
})