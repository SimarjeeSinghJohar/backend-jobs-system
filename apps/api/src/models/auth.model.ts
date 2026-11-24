import { Interface } from "readline";

export interface AuthModel {
    id?: string;
    email: string;
    tenant_id?: string;
    passwordHash?: string | null;
    role?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    passwordHash: string;
    name?: string;
    role?: string;
    tenantName?: string;
}

 export interface UpadateUser{
    email: string;
    passwordHash?: string;
    name?: string;
    role?: string;
    tenantName?: string;
 }