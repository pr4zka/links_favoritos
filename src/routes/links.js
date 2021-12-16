const express = require('express');
const router = express.Router();


const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, async (req, res) => {
    res.render('links/add')
});

router.post('/add', (req, res) => { // <- La función middleware ya no es async
    const { title, url, Descripcion } = req.body;
    const newLink = {
        title,
        url,
        Descripcion,
        user_id: req.user.id
        //ALMACENA ESOS DATOS EN LA VARIABLE NEWLINK
    };
    pool.query('INSERT INTO links set ?', [newLink], (error, results, fields) => { // <- usamos una función callback
        if (error) { // <- Si ocurre un error en la consulta
            console.log(error); // <- mostramos error por consola
            return res.status(500).send('error'); // <- enviamos mensaje al cliente
        }
        // ...
        // hacemos algo con los resultados (si lo necesitamos)
        // ...
        req.flash('success', 'Agregado Sastifactoriamente')
        res.redirect('/links'); // redirecionamos a la pagina con los links
    });
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]); //toma el id inico del usuario y le devuelve los enlaces
    res.render('links/list', { links });
});


router.get('/delete/:id', isLoggedIn, async (req, res) => {

    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID=? ', [id]);
    req.flash('success', 'Links Remove Successfuly');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE ID=?', [id]);
    console.log(links[0]);
    res.render('links/edit', { links: links[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, Descripcion, url } = req.body;
    const newLink = {
        title,
        Descripcion,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Links Update Successfuly');
    res.redirect('/links');
});


module.exports = router;
