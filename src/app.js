const express = require("express");
const db = require('./utils/database');
const ToDos = require("./models/todos.model");
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const app = express()
app.use(cors())
app.use(express.json())

db.authenticate()
    .then(()=> console.log("Base de datos conectada"))
    .catch((error)=> console.error(error));

db.sync()
    .then(()=> console.log("base de datos sincronizada"))
    .catch((error)=> console.error(error));


app.post('/api/v1/todos', async (req, res) =>{
    try{
        const newToDo = req.body
        await ToDos.create(newToDo);
        res.status(201).send();
    }
    catch (error){
        res.status(400).json(error)
    }
})
app.get('/', async (req, res)=>{
    try{
    console.log("Bienvenido a ToDos API. Con esta API puedes crear, ver, editar y eliminar ToDos.")
    }
    catch(error){
    res.status(400).json(error)
    }
})
app.get('/api/v1/todos', async (req, res)=>{
    try{
    const toDos = await ToDos.findAll();
    res.json(toDos)
    }
    catch(error){
    res.status(400).json(error)
    }
})
app.get('/api/v1/todos/:id', async (req, res)=>{
    try{
        const {id} = req.params
        console.log(req.params)
        const toDo = await ToDos.findByPk(id)
        res.json(toDo)
    }
    catch(error){
        res.status(400).json(error)
    }
});
app.delete('/api/v1/todos/:id', async (req, res)=>{
    try{
        const {id} = req.params
        await ToDos.destroy({
            where: {id}
        });
        res.status(204).send();
    }
    catch(error){
        res.status(400).json(error)
    }
});
app.put('/api/v1/todos/:id', async (req, res)=>{
    try{
        const {id} = req.params;
        const {title, completed} = req.body;
        await ToDos.update({title, completed}, {
            where: {id}
        });
        res.status(204).send();
    }
    catch (error){
        res.status(400).json(error)
    }
})
app.listen(8000, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}}`)
});