const axios = require("axios");
const {Videogame, Genre} = require("../db");
const {API_KEY} = process.env;

//la Api me trae 20 juegos por llamado, por lo cual voy a necesitar hacer 5 llamados para completar los 100
const getApiInfo= async ()=>  {
    let url = `https://api.rawg.io/api/games?key=${API_KEY}`
    try {
        const videogames= []
        for(let i=0; i<5; i++) {
            const response = await axios.get(url)
    
            response.data.results.map(e => {
                videogames.push({
                    id: e.id,
                    name: e.name,
                    released: e.released,
                    rating: e.rating,
                    genres: e.genres.map((e) => e.name),
                    platforms: e.parent_platforms.map((e) => e.platform.name),
                    img: e.background_image,
                })
            })
            url = response.data.next
        }
        return videogames 
    } catch (error) {
        console.log(error, "this is an error catched")
    }

}

// https://i.pinimg.com/originals/21/7d/b4/217db444f2a1ca3a8240b205ea49c86f.jpg

// traigo lo de mi DB
const getDbInfo = async () => {
    return await Videogame.findAll({
        include: [
            {
                model: Genre,
                attributes: ["name"],
                through: {
                    attributes:[]
                }
            }
        ]
    })
}
// Uno mis dos solicitudes
const getAllVideogames = async () => {
    try {

      const apiInfo = await getApiInfo();
      const dbInfo = await getDbInfo();

      const infoCompleta = dbInfo.concat(apiInfo);

      return infoCompleta;

    } catch (error) {
      console.log(error);
    }
  };


// ----- TRAIGO POR ID (PARAMS) ------
// busco en mi api
const getVideogameDetail = async (id) => {
    try {
        const apiData = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`) //aca busco el detalle del videogame en particular
       if(apiData){
            const videogameData = { // hago un objeto con todo el detalle del videojuego que mandé por id
            id: apiData.data.id,
            name: apiData.data.name,
            released: apiData.data.released,
            rating: apiData.data.rating,
            genres: apiData.data.genres.map((e) => e.name),
            platforms: apiData.data.parent_platforms.map((e) => e.platform.name),
            img: apiData.data.background_image,
            description: apiData.data.description_raw,
            }
            return videogameData
        }  else {
             return("There's no existing game with that id")
         }

    } catch (error) {
        console.log(error)
    }
}
// Busco en mi DB
const getIdDb = async (id) => {
    try {
        return await Videogame.findByPk(id, {
            include: [
                {
                    model: Genre,
                    attributes: ["name"],
                    through: {
                        attributes:[]
                    }
                }
            ]
        })
    } catch (error) {
        console.log(error)
    }
}
// Junto toda la solicitud de busqueda de id
const getAllVideogameId = async (id) => {
    const idDb = id.includes("-")
     if(idDb) {
            const VgDb = await getIdDb(id)
            return VgDb
    } else {
            const VgApi = await getVideogameDetail(id)
            return VgApi
    }

}



// ---- Traigo el juego por query -----
const getvideogameName = async (name) => {
    const apiName= await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`)
    // apiName = {{[]}} => me llega un objeto, que tiene una propiedad data y que a su vez tiene una propiedad results que es un []
    try {
        const videogameAllDetail = await apiName.data.results.map(e =>{
            return {

                id: e.id,
                name: e.name,
                released: e.released,
                rating: e.rating,
                genres: e.genres?.map((el) => el.name),
                platforms: e.parent_platforms.map((e) => e.platform.name),
                img: e.background_image,
                description: e.description_raw,
            }
        })      
        return videogameAllDetail
        
    } catch (error) {
        console.log(error)
    }
}








module.exports = {
    getApiInfo,
    getAllVideogames,
    getDbInfo,
    getAllVideogameId,
    getvideogameName
}