"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todos = [];
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/addtodo', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text
    };
    todos.push(newTodo);
    res.status(200).json({ message: 'Todo added successfully', todo: newTodo, allTodos: todos });
});
router.put('/updatetodo/:todoId', (req, res, next) => {
    const params = req.params;
    const body = req.body;
    const tid = params.todoId;
    const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
    if (todoIndex >= 0) {
        todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
        return res.status(200).json({ message: 'todo updated successfully', todos: todos });
    }
    res.status(404).json({ message: `can not find todo for this id ${tid}` });
});
router.delete('/deletetodo/:todoId', (req, res) => {
    const params = req.params;
    const tid = params.todoId;
    todos = todos.filter((todoItem) => todoItem.id !== tid);
    res.status(200).json({ message: 'todo deleted successfully', todos: todos });
});
exports.default = router;
