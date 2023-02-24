import express from "express";
import { PrismaClient, User } from "@prisma/client";

import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { usersController } from "./controllers/UserController";
import { reptilesController } from "./controllers/ReptileController";
import { feedingsController } from "./controllers/FeedingController";
import { husbandriesController } from "./controllers/HusbandryController";
import { schedulessController } from "./controllers/ScheduleController";


dotenv.config();

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

  const token = jwt.sign({ userId: user.id }, process.env.ENCRYPTION_KEY!!, { expiresIn: '1h' });
  
  res.json({ user, token }).status(200);
});

// --------------------------------------------------------
// Routes
//  - users/        : create user
//  - users/profile : get logged in users profile
// --------------------------------------------------------
usersController(app, prisma);

// --------------------------------------------------------
// Routes
//  - reptiles/add    : create reptile
//  - reptiles/remove : delete reptile
//  - reptiles/modify : update reptile
//  - reptiles/       : get all reptiles belonging
//                      to logged in user
// --------------------------------------------------------
reptilesController(app, prisma);

// --------------------------------------------------------
// Routes
//  - reptiles/feedings/add : create user
//  - reptiles/feedings/    : get all feedings belonging
//                            to logged in user
// --------------------------------------------------------
feedingsController(app, prisma);

// --------------------------------------------------------
// Routes
//  - reptiles/husbandry/add : create husbandry record
//  - reptiles/husbandry/    : get all husbandry records
//                             belonging to logged in user
// --------------------------------------------------------
husbandriesController(app, prisma);

// --------------------------------------------------------
// Routes
//  - schedules/add     : create user
//  - schedules/user    : get all schedules belonging 
//                        to logged in user
//  - schedules/reptile : get all schedules belonging 
//                        to a specific reptile
// --------------------------------------------------------
schedulessController(app, prisma);

// Pages //

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

// START //

app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;