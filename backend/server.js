const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
const bodyparser= require('body-parser')
const cors =require('cors')
dotenv.config()

app.use(cors())

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'Events';

const port = 3000
client.connect()

app.use(bodyparser.json())
//getting data
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('events');
  const findresult = await collection.find({}).toArray();
  res.json(findresult)
})

//post req
app.post('/',  async(req, res) => {
  const password = req.body
  console.log(password);
  const db = client.db(dbName);
  const collection = db.collection('events');
  await collection.insertOne(password)
  const findresult = await collection.find({}).toArray();
  res.send({success: true, findresult} )
})


// app.delete('/',  async(req, res) => {
//   const password = req.body
//   const db = client.db(dbName);
//   const collection = db.collection('passwords');
//   await collection.deleteOne(password)
//   const findresult = await collection.find({}).toArray();
//   res.send({success: true, findresult} )
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})