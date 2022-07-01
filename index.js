const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 4000
require('dotenv').config();


// mid ware
app.use(cors())
app.use(express.json())

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ouoh3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        await client.connect()
        const tasksCollection = client.db('TasksList').collection('tasks') 

        app.post('/task', async(req, res)=> {
            const task = req.body.task
            const results = await tasksCollection.insertOne({task})
            res.send(results)
        })

        app.get('/task', async(req, res)=> {
            const query = {}
            const results = await tasksCollection.find(query).toArray()
            res.send(results)
        })

        app.put('/task/:id', async(req, res)=> {
            const id = req.params.id.slice(1, req.params.id.length) 
            const task = req.body 
            const filter = {_id: ObjectId(id)} 
            const options = { upsert: true }
            const updateDoc = {
                $set: task,
                } 
            const results = await tasksCollection.updateOne(filter, updateDoc, options)
            res.send(results) 
        })
    }
    finally{}
}

run().catch(err => console.dir(err))

app.get('/', (req, res) => {
    res.send('Server running Successfully')
})

app.listen(port, ()=> {
    console.log(port);
})