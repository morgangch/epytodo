const {express, app, connection} = require('../../index.js');

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { storeToken, retrieveToken } = require('../../file/token.js');

const { getInfosFromId, getInfosFromEmail } = require('../user/user.query.js');

//use express.json() to parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    //get data from form
    const { email, name, firstname, password } = req.body;

    if (!email || !name || !firstname || !password) {
        return res.status(400).json({ msg: "Bad parameter" });
    } else {
        //hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        connection.query('INSERT INTO user (email, name, firstname, password) VALUES (?, ?, ?, ?)', [email, name, firstname, hash], (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(409).json({ msg: "Account already exists" })
                } else
                    res.status(500).json({ msg: "Internal server error" })
            } else {
                var id;
                getInfosFromEmail(email).then(function(result) {
                    id = result.id;
                    const token = jwt.sign({id: id}, process.env.SECRET);
                    res.setHeader('Set-Cookie', 'x-access-token=' + token + '; SameSite=Strict');
                    res.send({token: token})
                })
            }
        });
    }
})

app.post('/login', (req, res) => {
    //get data from form
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Bad parameter" })
    } else {
        getInfosFromEmail(email).then(function(result) {
            if (result) {
                const isMatch = bcrypt.compareSync(password, result.password);
                if (isMatch) {
                    var id = result.id;
                    const token = jwt.sign({id: id}, process.env.SECRET);
                    res.setHeader('Set-Cookie', 'x-access-token=' + token + '; SameSite=Strict');
                    res.send({token: token})
                } else {
                    res.status(401).json({ msg: "Bad credentials" })
                }
            } else {
                res.status(401).json({ msg: "Bad credentials" })
            }
        })
    }
})
