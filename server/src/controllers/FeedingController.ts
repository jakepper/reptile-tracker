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
            res.status(401).json({ message: "Unauthorized" });
            return;
        }  

        const { reptileId, foodItem } = req.body as CreateFeedingBody;
        const feeding = client.feeding.create({
            data: {
                reptileId,
                foodItem
            }
        });

        res.json({ feeding }).status(200);
    }

type GetFeedingsBody = {
    reptileId: number
}
const getFeedings = (client: PrismaClient): RequestHandler =>
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
    "reptiles/feeding",
    [
        { path: "/add", endpointBuilder: createFeeding, method: "post" },
        { path: "/", endpointBuilder: getFeedings, method: "get" },
    ]
)