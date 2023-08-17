"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var todos = [];
router.get('/', function (req, res, next) {
    res.status(200).json({ todos: todos });
});
router.post('/addtodo', function (req, res, next) {
    var newTodo = {
        id: new Date().toISOString(),
        text: req.body.text
    };
    todos.push(newTodo);
    res.status(200).json({ message: 'Todo added successfully', todo: newTodo, allTodos: todos });
});
router.put('/updatetodo/:todoId', function (req, res, next) {
    var tid = req.params.todoId;
    var todoIndex = todos.findIndex(function (todoItem) { return todoItem.id === tid; });
    console.log(todoIndex);
    console.log(tid);
    if (todoIndex >= 0) {
        todos[todoIndex] = { id: todos[todoIndex].id, text: req.body.text };
        return res.status(200).json({ message: 'todo updated successfully', todos: todos });
    }
    res.status(404).json({ message: "can not find todo for this id ".concat(tid) });
});
router.delete('/deletetodo/:todoId', function (req, res) {
    var tid = req.params.todoId;
    todos = todos.filter(function (todoItem) { return todoItem.id !== tid; });
    res.status(200).json({ message: 'todo deleted successfully', todos: todos });
});
exports.default = router;
