import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dtos/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";

type CreateReptileBody = {
    name: string
    species: string
    sex : string
}

const createReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
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

        res.json({ reptile });
    }

const deleteReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    }

const updateReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

    }

const getReptiles = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        });

        res.json({ user });
    }

export const reptilesController = controller(
    "reptiles",
    [
        { path: "/create", endpointBuilder: createReptile, method: "post" },
        { path: "/remove", endpointBuilder: deleteReptile, method: "delete" },
        { path: "/modify", endpointBuilder: updateReptile, method: "put" },
        { path: "/", endpointBuilder: getReptiles, method: "get" },
    ]
)