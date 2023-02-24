import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dtos/jwt";
import { controller } from "../lib/controller";


type CreateFeedingBody = {
    reptileId: number
    foodItem: string
}
const createFeeding = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }  

        const { reptileId, foodItem } = req.body as CreateFeedingBody;
        const feeding = await client.feeding.create({
            data: {
                reptileId,
                foodItem
            }
        });

        res.json({ feeding });
    }

type GetFeedingsBody = {
    reptileId: number
}
const getFeedings = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { reptileId } = req.body as GetFeedingsBody;
        const feedings = await client.feeding.findMany({
            where: {
                reptileId
            }
        });

        res.json({ feedings });
    }

export const feedingsController = controller(
    "reptiles/feedings",
    [
        { path: "/add", endpointBuilder: createFeeding, method: "post" },
        { path: "/", endpointBuilder: getFeedings, method: "get" },
    ]
)