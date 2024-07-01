const {express, app, connection} = require('../../index.js');

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user_query = require('./user.query.js');

//use express.json() to parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/user', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                user_query.getInfosFromId(decoded.id).then(function(result) {
                    if (!result)
                        res.status(404).json({ msg: "Not found" })
                    else
                        res.send(result)
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})

app.get('/user/todos', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                user_query.getTodosFromId(decoded.id).then(function(result) {
                    res.send(result)
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})

app.delete('/users/:id', async(req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                user_query.deleteUserFromId(req.params.id).then(function(result) {
                    if (result.affectedRows == 0)
                        res.status(404).json({ msg: "Not found" })
                    else
                        res.send({"msg": `Successfully deleted record number: ${req.params.id}`})
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})

app.put('/users/:id', async(req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                const { email, name, firstname, password } = req.body;
                if (!email || !name || !firstname || !password) {
                    return res.status(400).json({ msg: "Bad parameter" });
                }
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                user_query.updateUserFromId(req.params.id, email, name, firstname, hash).then(function(result) {
                    if (result.affectedRows == 0)
                        res.status(404).json({ msg: "Not found" })
                    else {
                        user_query.getInfosFromId(req.params.id).then(function(result) {
                            res.send(result)
                        })
                    }
                }).catch(function(error) {
                    res.status(500).json({ msg: "Internal server error" })
                })
            }
        })
    }
})

app.get('/users/:idOrEmail', async(req, res) => {
    const token = req.headers['x-access-token'] || req.headers.cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" })
    } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "Token is not valid" })
            } else {
                if (req.params.idOrEmail.includes('@')) {
                    user_query.getInfosFromEmail(req.params.idOrEmail).then(function(result) {
                        if (!result) {
                            res.status(404).json({ msg: "Not found" })
                        }
                        res.send(result)
                    }).catch(function(error) {
                        res.status(500).json({ msg: "Internal server error" })
                    })
                } else {
                    user_query.getInfosFromId(req.params.idOrEmail).then(function(result) {
                        if (!result) {
                            res.status(404).json({ msg: "Not found" })
                        }
                        res.send(result)
                    }).catch(function(error) {
                        res.status(500).json({ msg: "Internal server error" })
                    })
                }
            }
        })
    }
})
