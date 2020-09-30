const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;



const app = express()
app.use(cors())
app.use(bodyParser.json())



console.log(process.env.DB_USER, process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggbl3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products")
  const ordersCollection = client.db("emaJohnStore").collection("orders")
  
  app.post('/addProduct', (req, res) => {
    const products = req.body
    // console.log(products);
    productsCollection.insertOne(products) //to insert multiple use "insertMany"
    .then(result => {
      res.send(result.insertedCount)
    })
  })

  //read all products from server
  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //read single product from server
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  //send multiple product into review page
  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body
    productsCollection.find({key: {$in: productKeys}}) //caring multiple product keys
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //add orders form customer
  app.post('/addOrder', (req, res) => {
    const order = req.body 
    ordersCollection.insertOne(order) 
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
});







const port = 5000
app.listen(port)