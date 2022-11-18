const { Router } = require('express');
const axios = require('axios');
const {Videogame, Genre} = require("../db")
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogamesRoute = require("./videogames.js");
const videogameRoute = require("./videogame.js");
const genresRoute = require("./genres.js")


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', videogamesRoute); //Rutas GET /videogames: y GET /videogames?name="...":
router.use('/videogame', videogameRoute); // Ruta GET id
router.use('/genres', genresRoute);     // ruta GET genres
router.use('/videogames', videogamesRoute); // ruta POST






// [ ] POST /videogames:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de videojuego por body
// Crea un videojuego en la base de datos, relacionado a sus géneros.


module.exports = router;
