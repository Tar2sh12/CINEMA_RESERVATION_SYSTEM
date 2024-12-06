import express from "express";
import { config } from "dotenv";

import { db_connection } from "./DB/connection.js";
// import companyRouter from './src/modules/Company/company.routes.js'
import { UserRouter, MovieRouter } from "./src/modules/index.js";
// import jobRouter from './src/modules/Job/job.routes.js'
import { globaleResponse } from "./src/middleware/error-handling.middleware.js";

//import cors
import cors from "cors";
import { socketConnection } from "./src/utils/socket.io.utils.js";
import { client } from "./src/Redis/redis.js";

const app = express();

config();

const port = process.env.PORT || 5000;
//console.log(process.env.REDIS_PORT);

app.use(cors());
app.use(express.json());



// Connect to Redis
client.connect();

app.use("/user", UserRouter);
app.use("/movie", MovieRouter);
// app.use("/company", companyRouter);
// app.use("/job", jobRouter);

app.use(globaleResponse);
db_connection();

const serverApp = app.listen(port, () =>
  console.log(`listening on port ${port}!`)
);
const io = socketConnection(serverApp);
