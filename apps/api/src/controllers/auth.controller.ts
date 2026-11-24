import { Body, Controller, Post, Request, Response } from "@decorators/express";
import { AuthModel } from "../models/auth.model";
import {AuthService} from "./../services/auth.service";
import { container, TYPES } from "../../inversify.config";
import { UserRole } from "@prisma/client";

@Controller("/auth")
export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = container.get<AuthService>(TYPES.AuthService);
    }
    @Post("/login")
    async login(@Body() body: { email: string; password: string }, @Response() res: any): Promise<ApiResponse<{ token: string }>> {
        const { email, password } = body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        try {
            const token = await this.authService.authenticateUser(email, password);
            if (token) {
                return res.status(200).json({ 
                    message: "Login successful", 
                    token 
                });
            } else {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error: any) {
            return res.status(500).json({ 
                message: "Internal server error", 
                error: error.message 
            });
        }
    }

    @Post("/register")
    async register(@Body() body: { email: string; password: string; tenantName?: string, role?: UserRole }, @Response() res: any): Promise<ApiResponse<AuthModel>> {
        const { email, password, tenantName, role } = body;
        
        if (!email || !password || !role||!tenantName) {
            return res.status(400).json({ message: "Email, password, role, and tenantName are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        try {
            const result = await this.authService.registerUser(email, password, role, tenantName);
            return res.status(201).json({ 
                message: "Registration successful", 
                ...result 
            });
        } catch (error: any) {
            if (error.message === "User already exists") {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ 
                message: "Internal server error", 
                error: error.message 
            });
        }
    }
    
    @Post('/update/user')
    async updateUser(@Body() body:{email: string; password:string}, @Response() res: any): Promise<ApiResponse<void>> {
        const {email, password} = body;

        if(!email || !password){
            return res.status(400).json({message: "Email and Password are required "})
        }

        try{
            await this.authService.updateUserDetails(email, password);
            return res.status(200).json({message: "Password updated successfully"});
        }
        catch(error: any){
            if(error.message === "User not found"){
                return res.status(404).json({message: error.message});
            }
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    }
}
    