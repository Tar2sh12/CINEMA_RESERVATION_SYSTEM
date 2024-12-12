import { Movie } from "../../../DB/models/index.js";
import { isAuthQL } from "../Middlewares/authentication.middleware.js";
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
  return "movie deleted successfully";
};
