
const express = require('express')
const cors = require('cors'); 
const { MongoClient, ServerApiVersion , ObjectId } = require('mongodb');
require('dotenv').config() 
const app = express()
const port = process.env.PORT || 4000



// mid ware
app.use(cors())
app.use(express.json())

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ouoh3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// async function run(){
//     try {
//         await 
        client.connect()
        const tasksCollection = client.db('TasksList').collection('tasks')

        app.post('/task', async(req, res)=> {
            const task = req.body.task
            const email = req.body.email
            // console.log(email, task);
            const results = await tasksCollection.insertOne({email, task})
            // console.log(results);
            res.send(results)
        })

        app.get('/task', async(req, res)=> {
            
            const email = req.query.user
            const query = {email}
            // console.log(email);
            const results = await tasksCollection.find(query).toArray()
            // console.log(results);
            res.send(results)
        })

        app.put('/task/:id', async(req, res)=> {
            const id = req.params.id
            const task = req.body 
            const filter = {_id: ObjectId(id)} 
            const options = { upsert: true }
            const updateDoc = {
                $set: task,
                } 
            const results = await tasksCollection.updateOne(filter, updateDoc, options)
            res.send(results) 
        })

        app.put('/taskComplete/:id', async(req, res)=> {
            const id = req.params.id
            const status = req.body 
            const filter = {_id: ObjectId(id)} 
            const options = { upsert: true }
            const updateDoc = {
                $set: status,
                }
            const results = await tasksCollection.updateOne(filter, updateDoc, options)
            res.send(results) 
        })

        app.delete('/taskDelete/:id', async(req, res) => {
            const id = req.params.id
            const filter ={_id: ObjectId(id)}
            const results = await tasksCollection.deleteOne(filter)
            res.send(results)
        })
//     }
//     finally{}
// }

// run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server running Successfully')
})

app.listen(port, ()=> {
    console.log( 'Server running', port);
})