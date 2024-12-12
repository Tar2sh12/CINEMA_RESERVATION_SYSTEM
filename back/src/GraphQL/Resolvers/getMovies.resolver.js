import { Movie } from "../../../DB/models/index.js";
export const getMovies = async () => {
    const movies=await Movie.find();
    return movies;
}