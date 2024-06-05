const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://mdmejan2003c:LtXzewJ8L9wNUJjM@jersey-server.jsnraml.mongodb.net/?retryWrites=true&w=majority&appName=jersey-server";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    // jerseyDB---------------------------------

    const jerseyDB = client.db("jerseyDB");
    const userDB = client.db("userDB");
    const JerseysCollection = jerseyDB.collection("JerseysCollection");
    const UserCollection = userDB.collection("user_collection");

    app.post("/jerseys", async(req, res)=>{
        const jerseysData = req.body;
        const result = await JerseysCollection.insertOne(jerseysData);
        res.send(result);
    })
    app.get("/jerseys", async(req, res)=>{
        const jerseysData = JerseysCollection.find();
        const result = await jerseysData.toArray();
        res.send(result);

    })

    app.get("/jerseys/:id", async(req, res)=>{
        const id = req.params.id;
        const jerseysData = await JerseysCollection.findOne({_id: new ObjectId(id)});
        res.send(jerseysData);
    })

    app.patch("/jerseys/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await JerseysCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    app.delete("/jerseys/:id", async (req, res) => {
        const id = req.params.id;
        const result = await JerseysCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      });

    //   userDB-------------------------------------
    app.post('/user', async(req, res)=>{
        const user = req.body;
        const isUserExist = await UserCollection.findOne({email: user?.email});
        if(isUserExist?._id){
            return res.send("Login success")
        }
        const result = await UserCollection.insertOne(user);
        res.send(result); 
    })
app.get('/user/:email', async(req, res)=>{
    const email = req.params.email;
    const result = await UserCollection.findOne({email: email})
    res.send(result)
})

    console.log("Database is connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.log);


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, (req, res) => {
  console.log("App is listening on port :", port);
});


// mdmejan2003c
// LtXzewJ8L9wNUJjM