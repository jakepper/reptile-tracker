import express from "express";
import { PrismaClient, User } from "@prisma/client";

import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { usersController } from "./controllers/UserController";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser())

// AUTHENTICATE //

type LoginBody = {
  email: string,
  password: string
}

app.post("/sessions", async (req, res) => {
  const { email, password } = req.body as LoginBody;
  const user = await prisma.user.findFirst({
    where: {
      email,
    }
  });
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({
    userId: user.id
  }, process.env.ENCRYPTION_KEY!!, {
    expiresIn: '10m'
  });
  res.json({
    user,
    token
  })
});

// SIGN UP (users/) - GET USER (users/profile) //

usersController(app, prisma);

// START //

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;