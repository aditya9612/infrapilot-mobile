import { api } from './api';

export interface CreateBoqData {
    project_id: string | number;
    item_name: string;
    description?: string;
    quantity?: string | number;
    unit_cost?: string | number;
    status?: string;
    activity_type_id: string | number;
}

export const boqService = {
    /**
     * Creates a new BOQ entry
     */
    createBoq: async (data: CreateBoqData) => {
        try {
            const payload = {
                ...data,
                project_id: Number(data.project_id),
                activity_type_id: Number(data.activity_type_id),
                quantity: data.quantity ? Number(data.quantity) : undefined,
                unit_cost: data.unit_cost ? Number(data.unit_cost) : undefined,
                status: data.status || "Active",
            };

            const response = await api.post('/boq', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating BOQ:', error);
            throw error;
        }
    }
};
