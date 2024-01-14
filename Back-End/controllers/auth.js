import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

dotenv.config();

const getRandomImage = () => {
    const defaultProfileImages = [
        'https://i.pinimg.com/564x/92/02/75/9202753a82564278b2a50aac9bc64f3c.jpg',
        'https://i.pinimg.com/736x/42/3a/1f/423a1f1aa44a01f1c272353f75512e28.jpg',
        'https://i.pinimg.com/564x/3e/24/c2/3e24c27bfdef1208fbe04f8779491937.jpg',
        'https://i.pinimg.com/564x/0e/c0/8e/0ec08eaf171e1588d9c6287ffd7aa889.jpg',
        'https://i.pinimg.com/564x/26/63/89/266389faaaaa03707b43aea31dedaf25.jpg',
        'https://i.pinimg.com/564x/c8/1a/a4/c81aa4f9bd86972bebba551a0eca8cb3.jpg',
        'https://i.pinimg.com/564x/37/a0/0d/37a00de773c4ac2d54db67305a125860.jpg',
        'https://i.pinimg.com/564x/75/00/83/75008378aeb147ac19364b1c03b0d373.jpg',
        'https://i.pinimg.com/564x/f6/ac/ba/f6acba02c30ae5bd11726c90098f129b.jpg',
        'https://i.pinimg.com/564x/d9/3f/65/d93f6577edaedd7baf3dfb8d7516fe71.jpg',
        'https://i.pinimg.com/564x/78/cb/77/78cb7740bc38140e5367c04fff9ccaa7.jpg',
        'https://i.pinimg.com/564x/98/5e/81/985e81f690d019dd70d3b57274ee79d2.jpg',
        'https://i.pinimg.com/564x/1f/cf/b5/1fcfb5b1783bfe2635b682e50f2bdf10.jpg',
        'https://i.pinimg.com/564x/52/01/ff/5201ffc765a2d2fbcab0e52aaafdedd6.jpg',
        'https://i.pinimg.com/564x/61/e4/28/61e42824e50a8edc6aacc483cdf9c230.jpg',
        'https://i.pinimg.com/564x/72/64/9e/72649ef2101b1147cfa56fa36a08090e.jpg',
        'https://i.pinimg.com/564x/87/be/67/87be6779f0ee12fb01764ba6f9b26cf9.jpg',
        'https://i.pinimg.com/564x/c6/d1/fd/c6d1fd878d7a6c430d4c6f831d6fe76b.jpg',
        'https://i.pinimg.com/564x/c3/b7/5a/c3b75af2d465aa65fd1c6e2b21ba6c3f.jpg',
        'https://i.pinimg.com/564x/fd/98/ac/fd98ac787867efbca10ede69c68d90a2.jpg',
        'https://i.pinimg.com/564x/78/d7/5a/78d75aba3f0deabd37e7cc68c2f5896d.jpg',
    ];

    const randomIndex = Math.floor(Math.random() * defaultProfileImages.length);
    return defaultProfileImages[randomIndex];
};

const sendVerificationEmail = async (user) => {
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verificación de Cuenta',
        html: `<p>¡Gracias por registrarte! Haz clic en el siguiente enlace para verificar tu cuenta: <a href="${process.env.APP_URL}/confirm/${verificationToken}">Verificar cuenta</a></p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
    }
};

export const signup = async (req, res, next) => {
    try {
        const lowercaseName = req.body.name.toLowerCase();
        const lowercaseEmail = req.body.email.toLowerCase();

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const randomProfileImage = getRandomImage();

        const newUser = new User({
            ...req.body,
            name: lowercaseName,
            email: lowercaseEmail,
            password: hash,
            img: randomProfileImage,
        });

        await newUser.save();

        const user = await User.findOne({ name: lowercaseName });

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;

        await sendVerificationEmail(user);

        res.cookie('access_token', token, {
            httpOnly: true,
        });

        req.body = { name: lowercaseName, email: lowercaseEmail, password: req.body.password };

        await signin(req, res, next);
    } catch (error) {
        console.error('Error in signup:', error);
        // Manejar el error o registrar adecuadamente
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const signin = async (req, res, next) => {
    try {
        const lowercaseName = req.body.name.toLowerCase();

        const user = await User.findOne({ name: lowercaseName });

        if (!user) {
            return next(createError(404, "¡No se ha encontrado este usuario!"));
        }

        const isCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) {
            return next(createError(404, "¡Credenciales incorrectas!"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true
        })
            .status(200)
            .json(others);
    } catch (error) {
        next(error);
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
                isVerified: true,
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
            console.error("Duplicated Key:", error);
            res.status(400).json({ error: "This email is already connected to an account." });
        } else {
            console.error("Error SignupExternalAuth:", error);
            next(error);
        }
    }
};

export const checkName = async (req, res, next) => {
    try {
        const lowercaseName = req.body.name.toLowerCase();

        const existingUser = await User.findOne({ name: lowercaseName });

        if (existingUser) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error en checkName:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const checkEmail = async (req, res, next) => {
    try {
        const lowercaseEmail = req.body.email.toLowerCase();

        const existingEmail = await User.findOne({ email: lowercaseEmail });

        if (existingEmail) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error en checkEmail:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const checkPassword = async (req, res, next) => {
    try {
        const lowercaseName = req.body.name.toLowerCase();

        const user = await User.findOne({ name: lowercaseName });

        if (!user) {
            res.status(404).json({ exists: false });
        } else {
            const isCorrect = await bcrypt.compare(req.body.password, user.password);

            if (isCorrect) {
                res.status(200).json({ isCorrect: true });
            } else {
                res.status(200).json({ isCorrect: false });
            }
        }
    } catch (error) {
        console.error("Error en checkPassword:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};