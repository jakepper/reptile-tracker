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
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { reptileId, length, weight, temperature, humidity } = req.body as CreateFeedingBody;
        const husbandryRecord = await client.husbandryRecord.create({
            data: {
                reptileId,
                length,
                weight,
                temperature,
                humidity
            }
        });

        res.json({ husbandryRecord });
    }

type GetFeedingsBody = {
    reptileId: number
}
const getHusbandries = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { reptileId } = req.body as GetFeedingsBody;

        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            },
            include: {
                husbandryRecords: true
            }
        })

        if (reptile?.userId != userId) return res.status(401).json({ message: "Unauthorized" });

        res.json({ "husbandryRecords": reptile.husbandryRecords });
    }

export const husbandriesController = controller(
    "reptiles/husbandries",
    [
        { path: "/add", endpointBuilder: createHusbandry, method: "post" },
        { path: "/", endpointBuilder: getHusbandries, method: "get" },
    ]
)