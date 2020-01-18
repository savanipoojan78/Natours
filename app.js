const express = require('express');
const fs = require('fs');

const app = express();

// app.get('/', (req, res) => {
//     res.status(200);
//     res.json({ message: 'Hello from the server Side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//     res.send('ou can post to this URL');
// })

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

const port = 9033;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});