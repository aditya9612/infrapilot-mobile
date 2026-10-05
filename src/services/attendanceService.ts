import { api } from './api';

export interface AttendanceStatus {
    status: 'present' | 'absent' | 'none';
    inTime?: string;
    outTime?: string;
    workHours?: string;
    location?: string;
}

export interface AttendanceRecord {
    id: string;
    date: string;
    status: string;
    inTime: string;
    outTime: string;
    workHours: string;
    otHours: string;
    location: string;
    name?: string; // For labour/proxy attendance
}

export const attendanceService = {
    // Check In
    checkIn: async (data: { latitude: number; longitude: number; projectId?: string }) => {
        try {
            const response = await api.post('/attendance/check-in', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Check Out
    checkOut: async (attendanceId: string, data: { latitude: number; longitude: number }) => {
        try {
            const response = await api.put(`/attendance/check-out/${attendanceId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Today Status
    getTodayStatus: async (): Promise<AttendanceStatus | null> => {
        try {
            const response = await api.get('/attendance/today');
            return response.data?.data || response.data;
        } catch (error) {
            // Provide a fallback for now if it fails
            return null;
        }
    },

    // List Attendance
    getList: async (projectId?: string): Promise<AttendanceRecord[]> => {
        try {
            const params = projectId && projectId !== 'all' ? { project_id: projectId } : {};
            const response = await api.get('/attendance/list', { params });
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.data)) return response.data.data;
            return [];
        } catch (error) {
            // Fallback for demo purposes when API is not ready
            return [];
        }
    },

    // Proxy Check In
    proxyCheckIn: async (data: { user_id: string; latitude: number; longitude: number; projectId?: string }) => {
        try {
            const response = await api.post('/attendance/proxy-check-in', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Proxy Check Out
    proxyCheckOut: async (data: { attendance_id: string; latitude: number; longitude: number }) => {
        try {
            const response = await api.put('/attendance/proxy-check-out', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Export CSV
    exportCsv: async () => {
        try {
            const response = await api.get('/attendance/export/csv', { responseType: 'blob' });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
