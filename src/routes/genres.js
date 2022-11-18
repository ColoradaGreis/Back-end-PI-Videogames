const { default: axios } = require("axios");
const { Router }= require("express");

const { API_KEY } = process.env;
const { Genre } = require("../db.js")
// const {getAllVideogameId} = require('../controllers/index')

const router = Router()

router.get("/", async (req,res) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
        // console.log(apiGenres)
        
        const apiGenres = await response.data.results.map(e => e.name)
        // console.log(unGenres)
       
        apiGenres.map(e => Genre.findOrCreate({ //lo uso para guardar los generos que me traje de la API en la base de datos
            where: {name: e}
        }))

        const TotalGenres = await Genre.findAll() //me traigo todos los generos que guarde en mi db

        res.json(TotalGenres)

    } catch (error) {
        console.log(error)
    }
})


module.exports = router