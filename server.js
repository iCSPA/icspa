const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const db = new sqlite3.Database('./users.db');

// إعداد قاعدة البيانات
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);
});

// إعداد الميدل وير
app.use(bodyParser.urlencoded({ extended: true }));

// معالجة طلب التسجيل
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدخال البيانات في قاعدة البيانات
    db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, hashedPassword],
        (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Error registering user.');
            }
            res.send('User registered successfully!');
        }
    );
});

// تشغيل الخادم
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
