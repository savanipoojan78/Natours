const app = require('./app');

// SERVER START
const port = 9033;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});