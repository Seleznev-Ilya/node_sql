
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const db = require('../dataBase/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Provide an email or password',
            })
        }


        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {


            if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
                // res.status(401).render('login', {
                //     message: 'Email or password is incorrect',
                //     message_link: '/register'
                // })
                return res.status(422).send({
                    "field": "password",
                    "message": "Wrong email or password"
                },
                )
            } else {

                const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });

                return res.status(200).send({
                    "token": `${token}`
                });

                // console.log('Here is token: ' + token);

                // const cookieOptions = {
                //     expires: new Date(
                //         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                //     ),
                //     httpOnly: true,
                // }

                // res.cookie('jwt', 'Bearer ' + token, cookieOptions);
                // res.status(200).redirect('/');
            }

        })


    } catch (error) {
        console.log(error);
    }
}
exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            // return res.render('register', {
            //     message: 'That Email was registered',
            // });
            return res.status(422).send({
                "field": "email",
                "message": "That Email was registered"
            }
            )
        } else if (password !== passwordConfirm) {
            // return res.render('register', {
            //     message: 'Passwords do not match',
            // });
            return res.status(422).send({
                "field": "password",
                "message": "Passwords don't match "
            }
            )
        }

        let hashedPassword = await bcrypt.hash(password, 3);
        console.log(hashedPassword);


        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                // return res.render('register', {
                //     message: 'User registered'
                // })

                const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                return res.status(200).send({
                    "token": `${token}`
                });

            }

        })
    });
}
exports.me = (req, res) => {

    let headerToker = req.header('Authorization');

    try {
        let decoder = jwt.verify(headerToker, process.env.JWT_SECRET);


        db.query('SELECT * FROM users WHERE email = ?', decoder.email, (error, results) => {
            const { id, name, email } = results[0]
            return res.status(200).send({ id, name, email })
        })

    } catch (error) {
        return res.status(401).send()
    }

}
