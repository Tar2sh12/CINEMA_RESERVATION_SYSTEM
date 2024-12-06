import { Router } from "express";
const MovieRouter = Router();
// controllers
import * as controller from "./movie.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";

//schemas

// get the required middlewares
const {
  errorHandler,
  multerHost,
  auth,
  validationMiddleware,
  authorizationMiddleware,
} = middlewares;
// roles
import { roles, systemRoles } from "../../utils/index.js";
// routes
MovieRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.VENDOR)),
  errorHandler(controller.createMovie)
);
MovieRouter.get(
  "/",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.VENDOR_CUSTOMER)),
  errorHandler(controller.getMovie)
);

MovieRouter.get(
  "/specificMovie/:id",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.VENDOR_CUSTOMER)),
  errorHandler(controller.getMovieById)
);

MovieRouter.put(
  "/reserveMovie/:id",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.CUSTOMER)),
  errorHandler(controller.reserveMovie)
);


MovieRouter.get(
  "/moviesOfSpecificVendor",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.VENDOR)),
  errorHandler(controller.getMovieByVendorId)
);

MovieRouter.get(
  "/redis",
  errorHandler(controller.getMovieFromRedis)
);

//   MovieRouter.put(
//   "/update/:_id",
//   multerHost({ allowedExtensions: extensions.Images }).single("image"),
// //   errorHandler(validationMiddleware(updateCategorySchema)),
// //   errorHandler(auth()),
// //   errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
// //   getDocumentByName(Category),
//   errorHandler(controller)
// );

// MovieRouter.delete(
//   "/delete/:_id",
// //   errorHandler(validationMiddleware(deleteCategorySchema)),
// //   errorHandler(auth()),
// //   errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
//   errorHandler(controller)
// );

export { MovieRouter };
