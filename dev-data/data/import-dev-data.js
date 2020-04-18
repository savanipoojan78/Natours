const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
const fs = require('fs');
const Tour = require('../../models/tourModel');
const mongoose = require('mongoose');

const DB=process.env.DATABASE_LOCAL;
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB connection Successfull');
    });

//READ JSON File
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

//IMPORT DATA INTO DB

const importData = async() => {
    try {
        await Tour.create(tours);
        console.log('DATA successfull Loaded');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

//DELETE All DATA FROM DB

const deleteData = async() => {
    try {
        await Tour.deleteMany();
        console.log('DELETE all DATA from DB');
        process.exit();
    } catch (error) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
//console.log(process.argv);