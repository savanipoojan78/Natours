const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200);
    res.json({ message: 'Hello from the server Side', app: 'Natours' });
});

app.post('/', (req, res) => {
    res.send('ou can post to this URL');
})

const port = 9033;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});