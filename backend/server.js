const express = require("express");
const bodyParser = require("body-parser");
const { LocalStorage } = require("node-localstorage");
const cors = require("cors");

const app = express();
const port = 3000;

// Setting up localStorage
const localStorage = new LocalStorage("./scratch");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

app.use(bodyParser.json());
app.use(cors());

// Create a task
app.post("/tasks", (req, res) => {
  const task = {
    id: crypto.randomUUID(),
    title: req.body.title,
    description: req.body.description,
  };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  res.status(201).json(task);
});

// Read tasks with pagination
app.get("/tasks", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedTasks = tasks.slice(start, end);
  res.json(paginatedTasks);
});

// Read a single task
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  res.json(task);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).send("Task not found");
  }
  const deletedTask = tasks.splice(taskIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  res.json(deletedTask);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
