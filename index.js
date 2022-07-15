const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
var jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(express.json());
app.use(cors());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://quiet-mountain-32735.herokuapp.com",
//     ],
//     methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
//   })
// );

const verifyJWT = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  console.log("inside verify token", authHeaders);
  if (!authHeaders) {
    return res.status(401).send({ message: "unauthorized" });
  }
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

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
    const CompleteCollection = client.db("todlist_data").collection("complete");

    // auth
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "10d", // optional//
      });
      res.send({
        success: true,
        accessToken: accessToken,
      });
    });

    app.get("/addlist", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = todolistCollection.find(query);
      const allList = await cursor.toArray();
      res.send(allList);
    });
    app.get("/complete", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = CompleteCollection.find(query);
      const allList = await cursor.toArray();
      res.send(allList);
    });
    app.get("/addlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tools = await todolistCollection.findOne(query);
      res.send(tools);
    });
    // delete one
    app.delete("/addlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todolistCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/addlist", async (req, res) => {
      const newList = req.body;
      const result = await todolistCollection.insertOne(newList);
      res.send(result);
    });
    app.post("/complete", async (req, res) => {
      const newList = req.body;
      const result = await CompleteCollection.insertOne(newList);
      res.send(result);
    });
    app.put("/addlist/:id", async (req, res) => {
      const id = req.params.id;
      const updateList = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updateList.title,
          date: updateList.date,
          place: updateList.place,
        },
      };
      const result = await todolistCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
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
