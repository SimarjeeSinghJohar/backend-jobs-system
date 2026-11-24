export interface TenantModel {
    id: string;
    name: string;
    status?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}