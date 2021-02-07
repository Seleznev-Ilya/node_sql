const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const db = require('../dataBase/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { request } = require("express");
// const upload = require('express-fileupload');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });


exports.items = (req, res) => {
    let headerToker = req.header('Authorization');

    const { title, price } = req.body;
    if (!title || !price) {
        return res.status(422).send({
            "field": "title",
            "message": "Title is required"
        }
        )
    }

    try {
        let decoder = jwt.verify(headerToker, process.env.JWT_SECRET);

        db.query('SELECT * FROM users WHERE email = ?', decoder.email, async (error, results) => {
            const { id, name, email } = results[0];
            let user = id,
                createdAt = (new Date().getTime() / 1000);

            db.query('INSERT INTO items SET ?', {
                created_at: createdAt,
                title: title,
                price: price,
                image: '',
                user_id: user
            }, (error, results) => {
                if (error) {
                    console.log(error);
                }
                return res.status(200).send({
                    id: results.insertId,
                    created_at: createdAt,
                    title: title,
                    price: price,
                    image: '',
                    user_id: user,
                    user: { id, name, email }
                })
            })
        })
    } catch (error) {
        return res.status(401).send()
    }

}

exports.delereItems = (req, res) => {
    let headerToker = req.header('Authorization');

    const { id: idNum } = req.params;


    try {
        let decoder = jwt.verify(headerToker, process.env.JWT_SECRET);

        if (!decoder) {
            return res.status(401).send();
        } else {


            db.query('SELECT * FROM users WHERE email = ?', decoder.email, async (error, results) => {
                const { id, name, email } = results[0];
                let user = id;


                db.query(`SELECT * FROM items WHERE user_id = ${user} AND id = ${idNum}`, (error, results) => {
                    if (!results) {
                        return res.status(403).send(`${idNum}`);
                    } else {


                        db.query(`DELETE FROM items WHERE id = ${idNum}`, (error, results) => {
                            if (error) {
                                console.log(error);
                            }
                            return res.status(200).send(':)')
                        })


                    }
                })

            })
        }
    } catch (error) {
        return res.status(401).send()
    }
}

exports.updateItem = (req, res) => {
    let headerToker = req.header('Authorization');
    const { id: idNum } = req.params;

    const { title, price } = req.body;

    if (!price && !title) {
        return res.status(404).send(`${price}, ${title}`)
    }

    if (title.length < 3) {
        return res.status(422).send({
            "field": "title",
            "message": "Title should contain at least 3 characters"
        })
    }

    try {
        let decoder = jwt.verify(headerToker, process.env.JWT_SECRET);
        if (!decoder) {
            return res.status(401).send();
        }

        db.query('SELECT * FROM users WHERE email = ?', decoder.email, async (error, results) => {
            const { id, name, email } = results[0];
            let user = id;

            db.query(`SELECT * FROM items WHERE user_id = ${user}`, (error, results) => {
                if (!results) {
                    return res.status(403).send(`${idNum}`);
                } else {
                    const { created_at, image } = results
                    db.query(`UPDATE items SET title = ? , price = ? WHERE id = ?`, [title, price, idNum],
                        (error, results) => {
                            if (error) {
                                console.log(error);
                            }

                            return res.status(200).send({
                                id: idNum,
                                created_at: created_at,
                                title: title,
                                price: price,
                                image: image,
                                user_id: user,
                                user: { id, name, email }
                            })
                        })
                }
            })



        })
    } catch (error) {
        return res.status(401).send()
    }

}

exports.getItemById = (req, res) => {
    let headerToker = req.header('Authorization');
    const { id: idNum } = req.params;

    try {
        let decoder = jwt.verify(headerToker, process.env.JWT_SECRET);

        db.query('SELECT * FROM users WHERE email = ?', decoder.email, async (error, results) => {
            const { id, name, email, } = results[0];
            let user = id;

            db.query('SELECT * FROM items WHERE id = ?', idNum, (error, results) => {
                if (results) {
                    const { id, created_at, title, price, image, user_id } = results[0]
                    return res.status(200).send({
                        id: idNum,
                        created_at: created_at,
                        title: title,
                        price: price,
                        image: image,
                        user_id: user_id,
                        user: { user, name, email }
                    })
                }

            })
        })

    } catch (error) {
        return res.status(401).send()
    }
}

exports.getItemList = (req, res) => {
    db.query('SELECT * FROM items', (error, results) => {
        return res.status(200).send(results)
    })

}

exports.setItemImg = (req, res) => {
    return res.status(200).send()
}