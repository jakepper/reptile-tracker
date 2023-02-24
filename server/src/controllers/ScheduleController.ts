import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dtos/jwt";
import { controller } from "../lib/controller";

const TYPES = ["feed", "record", "clean"]

type CreateScheduleBody = {
    reptileId: number
    type: string
    description: string
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
}
const createSchedule = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }


        const { reptileId, type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as CreateScheduleBody;

        if (!TYPES.includes(type)) return res.status(400).json({ message: "Bad Request" });
        
        const schedule = await client.schedule.create({
            data: {
                userId,
                reptileId,
                type,
                description,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday
            }
        });

        res.json({ schedule }).status(200);
    }

const getUsersSchedules = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const schedules = await client.schedule.findMany({
            where: {
                userId
            }
        });

        res.json({ schedules }).status(200);
    }

type GetReptilesSchedulesBody = {
    reptileId: number
}
const getReptilesSchedules = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { reptileId } = req.body as GetReptilesSchedulesBody;
        const schedules = await client.schedule.findMany({
            where: {
                reptileId
            }
        });

        res.json({ schedules }).status(200);
    }

export const schedulessController = controller(
    "schedules",
    [
        { path: "/add", endpointBuilder: createSchedule, method: "post" },
        { path: "/user", endpointBuilder: getUsersSchedules, method: "get" },
        { path: "/reptile", endpointBuilder: getReptilesSchedules, method: "get" },
    ]
)