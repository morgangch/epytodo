const {express, app, connection} = require('../../index.js');

async function getAllTodos()
{
    return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM todo', (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

async function addTodo(body)
{
    return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)', [body.title, body.description, body.due_time, body.user_id, body.status], (error, results) => {
            if (error) {
                if (error.code == 'ER_NO_REFERENCED_ROW_2')
                    reject({msg: "Not found"})
                else
                    reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

async function getTodo(id)
{
    return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM todo WHERE id = ?', [id], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

async function updateTodoFromBody(id, body)
{
    return new Promise(function(resolve, reject) {
        connection.query('UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?', [body.title, body.description, body.due_time, body.user_id, body.status, id], (error, results) => {
            if (error) {
                if (error == 'ER_TRUNCATED_WRONG_VALUE')
                    reject({msg: "Bad parameter"})
                else
                    reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

async function deleteTodoFromId(id)
{
    return new Promise(function(resolve, reject) {
        connection.query('DELETE FROM todo WHERE id = ?', [id], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

module.exports = {getAllTodos, addTodo, getTodo, updateTodoFromBody, deleteTodoFromId}