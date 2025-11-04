import dotenv from "dotenv";
import express from "express";
import { corsSetup } from "./cors.js";
import { errorHandler } from "./error.handler.js";
import { routes } from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsSetup);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
