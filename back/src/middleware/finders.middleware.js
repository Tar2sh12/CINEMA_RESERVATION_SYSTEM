import { ErrorClass } from "../utils/index.js";

export const getDocumentByName = (model) => {
  return async (req, res, next) => {
    const modelInstance = new model();
    // Get the model name from the instance
    const modelName = modelInstance.constructor.modelName;
    const { name } = req.body;
    if (name) {
      const document = await model.findOne({ name });
      if (document) {
        return next(
          new ErrorClass(
            modelName+" name already exists",
            400,
            modelName+" name already exists"
          )
        );
      }
    }
    next();
  };
};

