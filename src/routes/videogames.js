const { Router }= require("express");
const {getDbInfo, getAllVideogames, getvideogameName, getApiInfo} = require('../controllers/index');
const { Videogame, Genre }= require("../db");

const router = Router()
// acá me voy a traer todos los videogames o por name

router.get('/', async (req, res) => {
    const { name }= req.query
    let getVideogames = await getAllVideogames()

    if(name){
        try {
            const foundGameInApi = await getvideogameName(name)
            // console.log(foundGameInApi)
            const getallGamesDb = await getDbInfo()
            let findGameInDb = getallGamesDb.filter(el => el.name.toLowerCase().includes(name.toLowerCase()))
            let allResults = findGameInDb.concat(foundGameInApi)
            allResults.length ? res.status(200).send(allResults.slice(0,15)) : res.status(400).send("There's no game with that name") 
            
        } catch (error) {
            console.log(error)
        }

    }else{
        res.send(getVideogames) //si no hay name, traeme todos los games
    }
})

router.post("/create", async (req, res) => {
    const {name, img, genres, released, rating, platforms, description} = req.body
     //la accion de crear una nueva instancia es asincrona, como manejo errores? con try y catch
     if(!name || !rating || !platforms || !genres) res.status(400).send("there are missing values")
     try {
        let newVideogame = await Videogame.create({ //le paso al create el objeto con todos los atributos que quiero que tenga mi nuevo videojuego
            name,
            img: img? img : "https://media0.giphy.com/media/g3ZlHx1iqhCOCcY3p2/giphy.gif?cid=ecf05e477iblwpq6v2huuh9f6iymzileg4yww4s8vk1c2gw0&rid=giphy.gif&ct=g",
            released: released? released : "No Date",
            rating,
            platforms,
            description: description? description : "A videogame"
        })
        const relation = await Genre.findAll({
            where: {name: genres}
        })
        await newVideogame.addGenre(relation) //a mi juego creado, le agrego algun genero
        res.json(newVideogame)

     } catch (error) {
        // console.log(error)
        res.status(400).send({msg: error})

     }

})
router.get('/platforms', async (req, res, next) => {
        
    try {
        const all = await getApiInfo();
        const allPlatforms = [];
        all.map(g => g.platforms.map(p => {
            if(!allPlatforms.includes(p)) {
                allPlatforms.push(p)
            }
        }))
        
    
        allPlatforms.length ? res.status(200).json(allPlatforms) : res.status(404).send('Error')

        }catch(e) {
            next(e)
        }
})

router.get('/filters', async(req, res) => {
    const {rating, opt, genres, source, platforms} = req.query
    try {
        let videoGames= await getAllVideogames()
        // console.log(videoGames, 'aca estoy mostrando lo que me da la ruta del back')

        if(genres){
            videoGames = videoGames.filter(e => e.genres.includes(genres) )
        }
        if(platforms){
            videoGames = videoGames.filter(e =>e.platforms.includes(platforms))
        }
        if(source === 'api'){
            videoGames = videoGames.filter(e => !e.createdinDb)
        } else if(source === 'created'){
            videoGames = videoGames.filter(e => e.createdinDb)
        }
        if(!videoGames.length) return res.status(200).json('there are no games with the filters selected')
               
        if(opt === 'ratingAsc'){
            videoGames = videoGames.sort((a,b) =>{
                if(a.rating > b.rating) return 1
                if(a.rating < b.rating) return -1
                return 0
            })
        } else if(opt === 'ratingDesc'){
            videoGames = videoGames.sort((a,b) =>{
                if(a.rating < b.rating) return 1
                if(a.rating > b.rating) return -1
                return 0
            })

        } else if(opt === 'A-Z'){
            videoGames = videoGames.sort((a,b) => {
                if(a.name.toLowerCase() > b.name.toLowerCase()) return 1
                if(a.name.toLowerCase() < b.name.toLowerCase()) return -1
                return 0    
            })
        } else if(opt === 'Z-A'){
            videoGames = videoGames.sort((a,b) => {
                if(a.name.toLowerCase() < b.name.toLowerCase()) return 1
                if(a.name.toLowerCase() > b.name.toLowerCase()) return -1
                return 0    
            })
        }
        res.status(200).json(videoGames)
    } catch (error) {
        res.status(400).json(error.message)
    }
})



module.exports = router