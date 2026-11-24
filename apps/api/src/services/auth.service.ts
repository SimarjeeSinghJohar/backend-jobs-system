import { inject, injectable } from "inversify";
import { PrismaClient, UserRole } from "@prisma/client";
import { Role } from "../../constants";

import { AuthModel, RegisterRequest } from "../models/auth.model.js";
import { TenantModel } from "../models/tenant.model.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { TYPES } from "../../types";
dotenv.config();


@injectable()
export class AuthService {
    private prisma: PrismaClient;
    constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
        this.prisma = prisma;
    }
  
    async authenticateUser(email: string, password: string): Promise<string | null> {
        
        const user: AuthModel | null  = await this.prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if(!user || !user.passwordHash) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if(isPasswordValid) {
            // Generate JWT token
            const token = Jwt.sign(
                { email: user.email , id: user.id, role: user.role, isActive: user.isActive},
                process.env.JWT_SECRET as string,
                { expiresIn: "3600s" }
            );
            return token;
        }
        return null;

    }

    async registerUser(email: string, password: string, role: UserRole , tenantName: string): Promise<{ user: AuthModel }> {

        const existingUser: AuthModel | null = await this.prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        let tenant : TenantModel | null = await this.prisma.tenant.findFirst({
            where: {
                name : tenantName,
            }
        });
        
        if (!tenant) {
            tenant = await this.prisma.tenant.create({
                data: {
                    name: tenantName,
                    status: "ACTIVE",
                }
            });
        }

        const saltRounds = 10;

        const passwordHash = await bcrypt.hash(password,saltRounds);

       
        
        const user: RegisterRequest = await this.prisma.user.create({
            data: {
                email: email,
                tenantId: tenant.id,
                passwordHash: passwordHash,
                role: role,
                isActive: true,
            },
        });

        return { user };
    }

    async updateUserDetails(email:string, password?: string, userRole?: UserRole  ): Promise<ApiResponse<void>>{
        const existingUser : AuthModel | null= await this.prisma.user.findFirst({
            where: {
                email
            }
        })
        const saltRounds = 10;
        if(existingUser){
            if(password){
                const passwordHash = await bcrypt.hash(password,saltRounds)

                await this.prisma.user.update({
                    where:{id: existingUser.id},
                    data: {passwordHash: passwordHash}
                })

            }
          
        } else {
            throw new Error("User not found");
        }
        return {message: "Password updated successfully"};
    }
}