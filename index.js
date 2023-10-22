const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnejwhv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     const brandCollection = client.db('brandDB').collection('brandName');
     app.get('/brandName',async(req,res)=>{
      const cursor=brandCollection.find();
      const result = await cursor.toArray();
      res.send(result)
     });
     app.get('/brandName/:brand',async(req,res) =>{
      const brand = req.params.brand;
      const query = {brandName: brand}
      const result = await brandCollection.find(query).toArray();
      res.send(result)
     })
     app.get('/brandName/brand/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await brandCollection.findOne(query);
      res.send(result)
     })

    app.put('/brandName/:brand/:id',async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options ={upsert :true};
      const updatedBrand = req.body;
      const brand ={
        $set : {
          name:updatedBrand.name,
          brandName:updatedBrand.brandName,
          image:updatedBrand.image,
          type:updatedBrand.type,
          price:updatedBrand.price,
          rating:updatedBrand.rating
        }
      }
      const result = await brandCollection.updateOne(filter,brand,options);
      res.send(result)

    })
    app.post('/brandName',async(req,res) =>{
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result)
      
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('Brand-shop making server is coming')
});
app.listen(port,()=>{
    console.log(`Brand-shop is running on port : ${port}`)
})