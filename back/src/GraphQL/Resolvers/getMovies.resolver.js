import { Movie } from "../../../DB/models/index.js";
//redis
import { client } from "../../../src/Redis/redis.js";
export const getMovies = async () => {
    const key = "movies";
      const moviesFromCache = await client.get(key);
      const moviesParsed = JSON.parse(moviesFromCache);
      if(!moviesParsed){
        return next(
          new ErrorClass(
            "there is no movies in cache",
            400,
            "there is no movies cache" 
          )
        );
      }
    return moviesParsed;
}