require('dotenv').config();
const config = require('./config.json');

const express = require('express');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const { stringify } = require('flatted');
const fs = require("fs");

const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');

const Product = require('./models/product');

const app = express();

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_REPLICA_URI || config.connectionString, connectionOptions);
const db = mongoose.connection;

// const path = require("path");
// const keyFilename = path.join(__dirname, "atomic-monument-321804-8f16eb1566f1.json");
// const projectId = "atomic-monument-321804";
// const gc = new Storage({ projectId, keyFilename });
//gc.getBuckets().then(x => console.log(x));
//console.log(data);
// const itemsBucket = gc.bucket('productbuck');
// const pubsub = new PubSub({ projectId, keyFilename });
// const topicName = 'product-topic';
// const subscriptionName = 'product-topic-sub';
// const subscription = pubsub.subscription(subscriptionName);
// const obj = [{
//     name: "Abhishek",
//     age: "25"
// }]
// async function publishMessage() {
//     // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
//     // const products = await Product.find();
//     const dataBuffer = Buffer.from("Hello");
//     console.log(dataBuffer)
//     try {
//         const messageId = await pubsub.topic(topicName).publish(dataBuffer);
//         console.log(`Message ${messageId} published.`);
//     } catch (error) {
//         console.error(`Received error while publishing: ${error.message}`);
//         process.exitCode = 1;
//     }
// }
// publishMessage();
db.on('error', (error) => console.error(error));
db.on('open', async () => {
    console.log('Connected to Database');
    // const collection = db.collection('products');
    // const changeStream = await collection.watch();

    // changeStream.on("change", async function (change) {
    //     console.log("changed successfully");
    // await exec('mongoexport --collection=products --db=products --out=D:\product.json', (err, stdout, stderr) => {
    //     if (err) {
    //         // node couldn't execute the command
    //         return;
    //     }
    //     // the *entire* stdout and stderr (buffered)
    //     console.log(`stdout: ${stdout}`);
    //     console.log(`stderr: ${stderr}`);
    // });
    // const filePath = path.join("D:\product.json");
    // async function uploadFile() {
    //     await itemsBucket.upload(filePath, {
    //         destination: itemsBucket.csv,
    //     });
    //     console.log(`${filePath} uploaded to ${itemsBucket.id}`);
    // }
    // uploadFile().catch(console.error);
    // });
});




app.use(express.json());

const productRouter = require('./routes/products');
const merchantRouter = require('./routes/merchants');

app.use('/products', productRouter);
app.use('/merchants', merchantRouter);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log("Server listening on port " + port));