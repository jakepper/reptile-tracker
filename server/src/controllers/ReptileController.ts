import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dtos/jwt";
import { controller } from "../lib/controller";

const SPECIES = ["ball_python", "king_snake", "corn_snake", "redtail_boa"]

type CreateReptileBody = {
    name: string
    species: string
    sex: string
}
const createReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!validReptile(req.body as ValidReptile)) {
            res.status(400).json({ message: "Bad Request" });
            return;
        }

        const { name, species, sex } = req.body as CreateReptileBody;
        const reptile = await client.reptile.create({
            data: {
                userId,
                name,
                species,
                sex,
            },
        });

        res.json({ reptile }).status(200);
    }

type DeleteReptileBody = {
    id: number
}
const deleteReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { id } = req.body as DeleteReptileBody;
        const reptile = await client.reptile.delete({
            where: {
                id
            }
        });

        res.json({ reptile }).status(200);
    }

type UpdateReptileBody = {
    id: number
    name?: string
    species?: string
    sex?: string
}
const updateReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!validReptile(req.body as ValidReptile)) {
            res.status(400).json({ message: "Bad Request" });
            return;
        }

        const { id, name, species, sex } = req.body as UpdateReptileBody;
        const reptile = await client.reptile.update({
            where: {
                id
            },
            data: {
                name,
                species,
                sex
            }
        })

        return res.json({ reptile }).status(200);
    }

const getReptiles = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const reptiles = await client.reptile.findMany({
            where: {
                id: userId
            }
        });

        res.json({ reptiles }).status(200);
    }

type ValidReptile = {
    sex?: string
    species?: string
}
const validReptile = (fields: ValidReptile): boolean => {
    if (fields.sex != undefined) {
        if (!fields.sex.match("m|f")) return false;
    }

    if (fields.species != undefined) {
        if (!SPECIES.includes(fields.species)) return false;
    }

    return true;
}

export const reptilesController = controller(
    "reptiles",
    [
        { path: "/add", endpointBuilder: createReptile, method: "post" },
        { path: "/remove", endpointBuilder: deleteReptile, method: "delete" },
        { path: "/modify", endpointBuilder: updateReptile, method: "put" },
        { path: "/", endpointBuilder: getReptiles, method: "get" },
    ]
)