import express from "express";
import { connect, getDb } from "./db/mongoDB";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { createUserRouter } from "./routes/user.routes";
import cors from "cors";
import { createShadowRouter } from "./routes/shadow.routes";
import { createDebtRouter } from "./routes/debt.routes";
import { DebtRepository } from "./repositories/debt.repository";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*"
}));

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "app";

async function start() {
    console.log("Trying to connect to mongoDB on: ", MONGO_URL);
    await connect(MONGO_URL);
    const db = getDb();

    const userRepo = new UserRepository(db);
    const authService = new AuthService(userRepo);
    const debtRepo = new DebtRepository(db);

    app.use("/users", createUserRouter(authService));
    app.use("/shadows", createShadowRouter());
    app.use("/debts", createDebtRouter(debtRepo));

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });

}

start();