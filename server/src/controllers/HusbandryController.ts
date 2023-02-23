import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dtos/jwt";
import { controller } from "../lib/controller";


type CreateFeedingBody = {
    reptileId: number
    length: number
    weight: number
    temperature: number
    humidity: number
}
const createHusbandry = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { reptileId, length, weight, temperature, humidity } = req.body as CreateFeedingBody;
        const feeding = client.feeding.create({
            data: {
                reptileId,
                length,
                weight,
                temperature,
                humidity
            }
        });

        res.json({ feeding }).status(200);
    }

type GetFeedingsBody = {
    reptileId: number
}
const getHusbandries = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { reptileId } = req.body as GetFeedingsBody;
        const feedings = client.feeding.findMany({
            where: {
                reptileId
            }
        });

        res.json({ feedings }).status(200);
    }

export const feedingsController = controller(
    "reptiles/husbandry",
    [
        { path: "/add", endpointBuilder: createHusbandry, method: "post" },
        { path: "/", endpointBuilder: getHusbandries, method: "get" },
    ]
)