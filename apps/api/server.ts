import  express , {Request, Response}  from "express";
import { AuthController } from "./src/controllers/auth.controller.js";
import { attachControllers } from "@decorators/express";
import "reflect-metadata"

// import  cors  from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// app.use(cors());

// Import controllers to register routes


// Manually instantiate controllers to register their routes

attachControllers(app, [AuthController]);
app.get("/", (req:Request, res:Response) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});