const express = require("express");
const bodyParser = require("body-parser");
const validator = require("validator");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const existingUsers = [
    { username: 'existinguser', email: 'user@example.com' }
];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const errors = [];

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push('Uživatelské jméno musí obsahovat pouze alfanumerické znaky.');
    }
    if (existingUsers.some(user => user.username === username)) {
        errors.push('Toto uživatelské jméno již existuje.');
    }

    if (!validator.isEmail(email)) {
        errors.push('Neplatný formát e-mailu.');
    }
    if (existingUsers.some(user => user.email === email)) {
        errors.push('Tento e-mail již existuje.');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
        errors.push('Heslo musí mít minimálně 8 znaků a obsahovat malé písmeno, velké písmeno, číslo a speciální znak.');
    }
    if (password.length > 16) {
        errors.push('Heslo nesmí být delší než 16 znaků.');
    }

    if (errors.length > 0) {
        return res.json({ success: false, errors });
    }

    existingUsers.push({ username, email });
    res.json({ success: true, message: 'Úspěšně zaregistrováno!' });
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
