import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repo.js";
import dotenv from 'dotenv'

export async function register({ name, email, password }) {
    const hashed = await bcrypt.hash( password, 10 );
    return userRepo.create({ name, email, password: hashed });
}

export async function login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('account not found, consider registering')

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('wrong password');

    return jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

export async function getUserById(userId) {
    return userRepo.findById(userId);
}