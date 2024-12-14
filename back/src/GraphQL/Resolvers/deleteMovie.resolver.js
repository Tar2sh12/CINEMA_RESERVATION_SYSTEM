import { Movie } from "../../../DB/models/index.js";
import { isAuthQL } from "../Middlewares/authentication.middleware.js";
//redis
import { client } from "../../../src/Redis/redis.js";
export const deleteMovie = async (parent, args) => {
  const { id,token } = args;
  //=====================authentication================
  const authUser = await isAuthQL(token);
  if (authUser instanceof Error) {
    throw new Error(authUser);
  }

  if (authUser?.isUserExists.userType !== "Vendor") {
    return new Error("you are not vendor");
  }
  const deletedMovie = await Movie.findByIdAndDelete(id);
  if (!deletedMovie) {
    return new Error("there is no matched movie");
  }

  const key = "movies";
  const firstthirtyMovies = await Movie.find().limit(30);
  console.log(firstthirtyMovies);
  await client.set(key, JSON.stringify(firstthirtyMovies));

  return "movie deleted successfully";
};
