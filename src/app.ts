import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/", routes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
