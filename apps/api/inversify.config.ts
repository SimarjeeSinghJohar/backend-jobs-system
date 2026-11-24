import {Container} from "inversify";
import { AuthService } from "./src/services/auth.service";
import { PrismaClient } from "@prisma/client";
import "reflect-metadata";
import "dotenv/config";
import { TYPES } from "./types";

const container = new Container();
const prisma = new PrismaClient();

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

export { container, TYPES };

