import express from "express";
import { MongoClient } from "mongodb";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { createUserRouter } from "./routes/user.routes";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "app";

async function start() {

    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const db = client.db(DB_NAME);

    const userRepo = new UserRepository(db);
    const authService = new AuthService(userRepo);

    app.use("/users", createUserRouter(authService));

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });

}

start();