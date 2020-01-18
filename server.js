const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(process.env);

// SERVER START
const port = 9033 || process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});