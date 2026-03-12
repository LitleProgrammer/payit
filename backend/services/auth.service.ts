import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { isStrongPassword } from "../utils/password.util";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export class AuthService {

    constructor(private userRepo: UserRepository) { }

    async signup(username: string, password: string) {

        if (!isStrongPassword(password)) {
            throw new Error("Password too weak");
        }

        const existingUser = await this.userRepo.findByUsername(username);

        if (existingUser) {
            throw new Error("Username already exists");
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await this.userRepo.createUser({
            username,
            passwordHash,
            createdAt: new Date()
        });

        return user;
    }

    async login(username: string, password: string) {

        const user = await this.userRepo.findByUsername(username);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return { token };
    }
}