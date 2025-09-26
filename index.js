import express from "express";
import mongoose from "mongoose";
import mongod from "./db/db-mongo.js"
import Task from "./models/taskSchema.js"

const server = express();
const port = 3000;

server.use(express.urlencoded());
server.use(express.json())

server.get("/", (_, res) => {
    res.send("Alive!!:)");
})

server.post("/tasks", async (req, res) => {
    try {
        const { name, priority, status } = req.body;
        const task = await Task.create({ name, priority, status });
        res.json({
            message: "Task created successfully!!",
            task: task
        })
    } catch (e) {
        res.send(e)
    }
})

server.get("/tasks", async (_, res) => {
    const tasks = await Task.find();
    res.json(tasks);
})

server.get("/tasks/search", async (req, res) => {
    try {
        const { termo } = req.query;
        const tasks = await Task.find();

        const filtered = tasks.filter(t => {
            return (
                t.name.toLowerCase().includes(termo.toLowerCase()) ||
                t.priority.toLowerCase().includes(termo.toLowerCase()) ||
                t.status.toLowerCase().includes(termo.toLowerCase())
            );
        });

        res.json(filtered);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

server.get("/tasks/:id", async (req, res) => {
    const detailsTask = await Task.findById(req.params.id);
    res.json(detailsTask);
})



server.put("/tasks/:id", async (req, res) => {
    try {
        const { name, priority, status } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, { name, priority, status }, { new: true });
        res.send("Task updated successfuly!!", task)
    } catch (e) {
        res.send(e)
    }
})

server.delete("/tasks/:id", async (req, res) => {
    const taskDeleted = await Task.findByIdAndDelete(req.params.id);
    res.json(taskDeleted);
})

mongoose.connect(mongod.getUri()).then(() => {
    server.listen(3000);
    console.log(`Running at http://localhost:${port}`);
}).catch((e) => {
    console.log("Connect failed ", e)
});