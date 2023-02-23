import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dtos/jwt";
import { controller } from "../lib/controller";


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
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { reptileId, type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as CreateScheduleBody;
        const husbandryRecord = client.schedule.create({
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

        res.json({ husbandryRecord }).status(200);
    }

const getUsersSchedules = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const husbandryRecords = client.schedule.findMany({
            where: {
                userId
            }
        });

        res.json({ husbandryRecords }).status(200);
    }

type GetReptilesSchedulesBody = {
    reptileId: number
}
const getReptilesSchedules = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { reptileId } = req.body as GetReptilesSchedulesBody;
        const husbandryRecords = client.schedule.findMany({
            where: {
                reptileId
            }
        });

        res.json({ husbandryRecords }).status(200);
    }

export const schedulessController = controller(
    "schedules/",
    [
        { path: "/add", endpointBuilder: createSchedule, method: "post" },
        { path: "/users", endpointBuilder: getUsersSchedules, method: "get" },
        { path: "/reptiles", endpointBuilder: getReptilesSchedules, method: "get" },
    ]
)