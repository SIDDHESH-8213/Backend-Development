const express = require('express');
const {v4 :uuidv4} = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

let tasks = [];

app.post('/tasks', (req, res) =>{
    const task = req.body;
    task.id = uuidv4();
    tasks.push(task);
    res.status(201).send(task);
})

app.get('/tasks', (req, res) =>{
    res.status(201).send(tasks);
})

app.get('/tasks/:id', (req,res) =>{
    const task = tasks.find(t => t.id === req.params.id)
    if(!task) return res.status(404).send("No task found")
    res.status(201).send(task);
})

app.put('/tasks/:id', (req, res) =>{
    const task = tasks.find(t => t.id === req.params.id)
    if(!task) return res.status(404).send('No task found')
    task.name = req.body.name;
    task.completed = req.body.completed
    res.status(201).send(task);
})

app.delete('/tasks/:id', (req, res) =>{
    const task = tasks.findIndex(t => t.id === req.params.id)
    if(task === -1) return res.status(404).send('NO task found')
    tasks.splice(task, 1);
    res.send({message : 'Task Deleted'})
    
})


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})