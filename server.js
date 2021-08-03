require('dotenv').config();
const config = require('./config.json');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.on('open', () => console.log('Connected to Database'));

app.use(express.json());

const productRouter = require('./routes/products');
const merchantRouter = require('./routes/merchants');

app.use('/products', productRouter);
app.use('/merchants', merchantRouter);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log("Server listening on port " + port));