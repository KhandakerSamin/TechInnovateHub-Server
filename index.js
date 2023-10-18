const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// midleware 
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vheow1k.mongodb.net/?retryWrites=true&w=majority`;

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

    // brand database
    const brandCollection = client.db("TechInnovateHubDB").collection("brand");
    // product database
    const productCollection = client.db("TechInnovateHubDB").collection("product");
    //cart database
    const cartCollection = client.db("TechInnovateHubDB").collection("cart");


    // API for brand

    app.get('/brands', async (req, res) => {
      const brands = await brandCollection.find().toArray()
      res.send(brands)
    })

    app.post('/brands', async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result)
    })

    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const products = await productCollection.find({ brand: brand }).toArray();
      res.json(products);
    });

    // API for Products

    app.get('/products', async (req, res) => {
      const prouducts = await productCollection.find().toArray()
      res.send(prouducts)
    })

    app.get('/updateProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    app.put('/updateProduct/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedproduct = req.body;
      const product = {
        $set: {
          name: updatedproduct.name,
          brand: updatedproduct.brand,
          category: updatedproduct.category,
          description: updatedproduct.description,
          price: updatedproduct.price,
          rating: updatedproduct.rating,
          photo: updatedproduct.photo
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })

    // api for cart

    app.get('/cartProducts' , async(req, res) => {
      const cartProuducts = await cartCollection.find().toArray()
      res.send(cartProuducts)
    }) 

    app.post('/cartProducts' , async(req, res) => {
      const newCartProduct = req.body;
      console.log(newCartProduct);
      const result = await cartCollection.insertOne(newCartProduct);
      res.send(result);
    })

    app.delete('/cartProducts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
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


app.get('/', (req, res) => {
  res.send('TechInnovateHub is running on server');
});

app.listen(port, () => {
  console.log(`TechInnovateHub server is running : ${port}`);
})