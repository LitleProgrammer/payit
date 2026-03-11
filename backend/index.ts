import express from "express";
import { connect } from "./db/mongoDB";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

const start = async () => {
    await connect(process.env.MONGO_URL || "");

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
};

start();