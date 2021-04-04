const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;



const uri = "mongodb+srv://organicUser:organic123@cluster0.byvei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sending html file 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents) 
    })
  })

  // sigle product collection

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })


  app.post("/addProduct", (req, res) => {
    const product = req.body
    productCollection.insertOne(product)
    .then(result => {
      console.log('data added successfully...')
      res.redirect('/')
    })
  })

  // patch product

  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)}, 
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  // delete product

  app.delete('/delete/:id', (req, res) => {
    console.log(req.body.price);
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( (result) => {
      res.send(result.deletedCount > 0);
    })
  })
  // client.close();
});


app.listen(3000);