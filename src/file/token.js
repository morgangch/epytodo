const fs = require('fs');

function storeToken(token) {
    fs.writeFile('token.txt', token, (err) => {
        if (err) {
            console.error('Error storing token:', err);
        }
    });
}

async function retrieveToken() {
    return new Promise(function(resolve, reject) {
        fs.readFile('token.txt', 'utf8', (err, data) => {
            if (err) {
                reject('Error retrieving token:', err);
            } else {
                resolve(data);
            }
        });
    });    
}

module.exports = { storeToken, retrieveToken };