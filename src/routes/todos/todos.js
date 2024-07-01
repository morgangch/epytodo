const {express, app, connection} = require('../../index.js');

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const todos_query = require('./todos.query.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/todos', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                todos_query.getAllTodos().then(function(result) {
                    res.send(result)
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})

app.post('/todos', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                const { title, description, due_time, user_id, status } = req.body;
                if (!title || !description || !user_id || !status) {
                    res.status(400).json({ msg: "Please enter all fields" })
                } else {
                    todos_query.addTodo({
                        title,
                        description,
                        due_time,
                        user_id,
                        status
                    }).then(function(result) {
                        if (result.affectedRows == 1)
                            res.send({title, description, due_time, user_id, status})
                    }).catch(function(error) {
                        res.status(500).json({ msg: "Internal server error" })
                    })
                }   
            }
        })
    }
})

app.get('/todos/:id', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                todos_query.getTodo(req.params.id).then(function(result) {
                    res.send(result)
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})

app.put('/todos/:id', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                const { title, description, due_time, user_id, status } = req.body;
                if (!title || !description || !user_id || !status) {
                    res.status(400).json({ msg: "Please enter all fields" })
                } else {
                    todos_query.updateTodoFromBody(req.params.id, {
                        title,
                        description,
                        due_time,
                        user_id,
                        status
                    }).then(function(result) {
                        if (result.affectedRows === 0)
                            res.status(404).json({ msg: "Not found" })
                        else
                            res.send({title, description, due_time, user_id, status})
                    }).catch(function(error) {
                        res.status(500).json({ msg: "Internal server error" })
                    })
                }   
            }
        })
    }
})

app.delete('/todos/:id', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                todos_query.deleteTodoFromId(req.params.id).then(function(result) {
                    if (result.affectedRows === 0)
                        res.status(404).json({ msg: "Not found" })
                    else
                        res.send({msg:  `Successfully deleted record number: ${req.params.id}`})
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})
