import express from "express";
import routes from "../routes";
import cors from "cors"
import connectDb from "./connectDb";

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cors())


  routes(app);

  connectDb()

  return app;
}

export default createServer;