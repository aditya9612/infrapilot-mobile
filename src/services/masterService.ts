import { api } from './api';


export interface ActivityType {
    id: number | string;
    name: string;
}

export const masterService = {
    /**
     * Fetch all available activity types for BOQ and tasks
     */
    getActivityTypes: async (): Promise<ActivityType[]> => {
        try {
            const response = await api.get('master/activity-types');
            const data = response.data;
            const items = Array.isArray(data) ? data : (data?.items || data?.data || []);

            return items.map((a: any) => ({
                id: a.activity_type_id || a.id,
                name: a.name || a.activity_name || `Activity ${a.id}`
            }));
        } catch (error: any) {
            console.error('Error fetching activity types:', error);
            // Alert.alert("Activity Fetch Error", JSON.stringify(error?.response?.data || error?.message));
            return [];
        }
    }
};
