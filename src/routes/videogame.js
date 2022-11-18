const { Router }= require("express");
require('dotenv').config();
const {getAllVideogameId} = require('../controllers/index')

const router = Router()

router.get('/:id', async (req, res) => {
    const {id} = req.params
    let game = await getAllVideogameId(id)
    try {
        game? res.send(game) : res.status(400).send("videogame not found")
        
    } catch (error) {
        console.log(error)
    }
})





module.exports = router