const {express, app, connection} = require('../../index.js');

async function getInfosFromId(id)
{
    return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results[0])
            }
        });
    });
}

async function getInfosFromEmail(email)
{
    return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results[0])
            }
        });
    });
}

async function deleteUserFromId(id)
{
    return new Promise(function(resolve, reject) {
        connection.query('DELETE FROM todo WhERE user_id = ?', [id], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                connection.query('DELETE FROM user WHERE id = ?', [id], (error, results) => {
                    if (error) {
                        reject({msg: "Internal server error"})
                    } else {
                        resolve(results)
                    }
                });
            }
        })
    })
}

async function updateUserFromId(id, email, name, firstname, password) {
    return new Promise(function(resolve, reject) {
        connection.query('UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?', [email, password, name, firstname, id], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

async function getTodosFromId(id)
{
    return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM todo WHERE user_id = ?', [id], (error, results) => {
            if (error) {
                reject({msg: "Internal server error"})
            } else {
                resolve(results)
            }
        });
    });
}

module.exports = { getInfosFromId, getInfosFromEmail, deleteUserFromId, updateUserFromId, getTodosFromId };