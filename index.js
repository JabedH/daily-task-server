const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://daily-task:q5dERTEyAF7q84LL@cluster0.jptsq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todolistCollection = client.db("todlist_data").collection("addlist");
    app.get("/addlist", async (req, res) => {
      const query = {};
      const cursor = todolistCollection.find(query);
      const allList = await cursor.toArray();
      res.send(allList);
    });
    app.get("/addlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tools = await todolistCollection.findOne(query);
      res.send(tools);
    });
    app.post("/addlist", async (req, res) => {
      const newList = req.body;
      const result = await todolistCollection.insertOne(newList);
      res.send(result);
    });
    app.patch("/addlist/:id", async (req, res) => {
      const email = req.query.email;
      const info = req.body;
      console.log(info, email);
      const filter = { email: email };
      const allCollection = await todolistCollection.updateOne(info, filter);
      res.send(allCollection);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello FROM DAILY TASK!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
