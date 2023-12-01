import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

dotenv.config();

export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();

        const user = await User.findOne({ name: req.body.name });
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true
        });

        req.body = { name: req.body.name, password: req.body.password };
        await signin(req, res, next);
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (!user) return next(createError(404, "¡No se ha encontrado este usuario!"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrect) return next(createError(404, "¡Credenciales incorrectas!"));

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true
        })
            .status(200)
            .json(others);
    } catch (error) {
        next(error)
    }

}

export const SigninExternalAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .status(200)
                .json(user._doc);
        } else {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const SignupExternalAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            res
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .status(200)
                .json(savedUser._doc);
        } else {
            const error = new Error("User already exists");
            error.status = 400;
            throw error;
        }
    } catch (error) {
        if (error.code === 11000) {
            // Manejar el error de clave duplicada (nombre duplicado en este caso)
            console.error("Duplicated Key:", error);
            // Puedes enviar una respuesta al cliente indicando que el usuario ya existe
            res.status(400).json({ error: "This email is already connected to an account." });
        } else {
            // Otro tipo de error, propagarlo
            console.error("Error SignupExternalAuth:", error);
            next(error);
        }
    }
};

export const checkName = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ name: req.body.name });

        if (existingUser) {
            // The username is already taken
            res.status(200).json({ exists: true });
        } else {
            // The username is available
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        // Handle errors
        console.error("Error in checkName:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const checkEmail = async (req, res, next) => {
    try {
        const existingEmail = await User.findOne({ email: req.body.email });

        if (existingEmail) {
            // El correo electrónico ya está tomado
            res.status(200).json({ exists: true });
        } else {
            // El correo electrónico está disponible
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        // Manejar errores
        console.error("Error en checkEmail:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const checkPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            // El usuario no existe
            res.status(404).json({ exists: false });
        } else {
            const isCorrect = await bcrypt.compare(req.body.password, user.password);

            if (isCorrect) {
                // La contraseña es correcta
                res.status(200).json({ isCorrect: true });
            } else {
                // La contraseña no es correcta
                res.status(200).json({ isCorrect: false });
            }
        }
    } catch (error) {
        // Manejar errores
        console.error("Error en checkPassword:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
