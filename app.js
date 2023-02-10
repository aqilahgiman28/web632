/**
 * REFERENCES
 * AUTH: https://www.bezkoder.com/node-js-mongodb-auth-jwt/
 */

const express = require('express');
const cors = require('cors')
const {connectDB} = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

void connectDB()

app.use( require('./routes/index'))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: 'Something broke!'})
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
