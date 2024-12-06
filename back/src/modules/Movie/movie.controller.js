import slugify from "slugify";
import { nanoid } from "nanoid";
// utils
import { ErrorClass } from "../../utils/error-class.utils.js";
import { cloudinaryConfig } from "../../utils/cloudinary.utils.js";
// models
import { Movie } from "../../../DB/models/index.js";
import { getIo } from "../../utils/index.js";
//redis
import { client } from "../../../src/Redis/redis.js";
/**
 * @api {POST} /categories/create  create a  new movie
 */
export const createMovie = async (req, res, next) => {
  // destructuring the request body
  const { title, description, dates } = req.body;
  const time_reservation = [];

  dates.forEach((date) => {
    const specificDate = new Date(date.y, date.m, date.d, date.h, date.min, 0);
    const formattedObject = {
      time_available: specificDate,
      usersId: [],
    };
    time_reservation.push(formattedObject);
  });
  const createdBy = req.authUser._id;

  // Generating movie slug
  const slug = slugify(title, {
    replacement: "_",
    lower: true,
  });

  // Image
  if (!req.file) {
    return next(
      new ErrorClass("Please upload an image", 400, "Please upload an image")
    );
  }
  // upload the image to cloudinary
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Movies/${customId}`,
    }
  );

  // prepare movie object
  const movie = new Movie({
    title,
    description,
    time_reservation,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
    createdBy,
  });

  // create the movie in db
  const newMovie = await movie.save();
  const key = "movies";
  const existingValue = await client.get(key);
  if (!existingValue) {
    const firstthirtyMovies = await Movie.find().limit(30);
    await client.set(key, JSON.stringify(firstthirtyMovies));
  } else {
    const moviesFromCache = await client.get(key);
    const moviesParsed = JSON.parse(moviesFromCache);
    if(moviesParsed.length >= 30){
      moviesParsed.filter((movie, i) => i == 1);
    }
    moviesParsed.push(newMovie);
    await client.set(key, JSON.stringify(moviesParsed));
  }
  // send the response
  res.status(201).json({
    status: "success",
    message: "movie created successfully",
    data: newMovie,
  });
};

export const getMovieFromRedis = async (req, res, next) => {
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
  res.status(200).json({
    data: moviesParsed,
  });
};
export const getMovie = async (req, res, next) => {
  const movies = await Movie.find().populate("time_reservation.usersId.userId");

  res.status(200).json({
    data: movies,
  });
};

// get movie by id
export const getMovieById = async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findById(id).populate(
    "time_reservation.usersId.userId"
  );
  if (!movie) {
    return next(
      new ErrorClass(
        "there is no matched movie",
        400,
        "there is no matched movie"
      )
    );
  }
  res.status(200).json({
    data: movie,
  });
};

//reserve specific date in movie
export const reserveMovie = async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  if (!movie) {
    return next(
      new ErrorClass(
        "there is no matched movie",
        400,
        "there is no matched movie"
      )
    );
  }
  const { date, seats } = req.body;

  const userId = req.authUser._id;
  movie.time_reservation.forEach((time) => {
    const formattedDate = new Date(date).toDateString();
    if (time.time_available.toDateString() == formattedDate) {
      const user = time.usersId.find(
        (user) => user.userId.toString() == userId.toString()
      );

      var seats_reserved_by_different_customers = [];
      time.usersId.forEach((userr) => {
        if (userr.userId.toString() != userId.toString() ) {
          seats_reserved_by_different_customers = [
            ...seats_reserved_by_different_customers,
            ...userr.seats_reserved,
          ];
        }
      });
      if (user == null) {
        time.usersId.push({ userId, seats_reserved: seats });
      } else {
        var oldSeats = [...user.seats_reserved];
        seats.forEach((seat) => {
          const found = seats_reserved_by_different_customers.find((s) => s == seat);
          if (found) {
            return next(
              new ErrorClass(
                "there is seat in this list already reserved by another user",
                400,
                "there is seat in this list already reserved by another user"
              )
            );
          }
          if (seat > 47 || seat <= 0) {
            return next(
              new ErrorClass(
                "you entered wrong seat number",
                400,
                "you entered wrong seat number"
              )
            );
          }
          oldSeats = oldSeats.filter((s) => s == seat);
        });
        user.seats_reserved = [...oldSeats, ...seats];
      }
    }
  });
  const savedMovie = await movie.save();
  getIo().emit("newMovie", {
    message: `${movie.title} reserved by ${userId}`,
    userId: userId,
    movieId: movie._id,
  });
  res.status(200).json({
    data: savedMovie,
  });
};

export const getMovieByVendorId = async (req, res, next) => {
  const userId = req.authUser._id;
  const movie = await Movie.find({ createdBy: userId }).populate(
    "time_reservation.usersId.userId"
  );
  if (!movie) {
    return next(
      new ErrorClass("there is no movies", 400, "there is no movies")
    );
  }
  res.status(200).json({
    data: movie,
  });
};
