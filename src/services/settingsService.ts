import { api } from './api';

export interface UserProfile {
    full_name?: string;
    designation?: string;
    email?: string;
    mobile?: string;
    pan_number?: string;
    aadhaar_number?: string;
    role?: string;
    joining_date?: string;
    address?: string;
    account_active?: boolean;
    avatar_url?: string;
}

export interface AppSettings {
    user_id?: number;
    default_project_id?: number;
    unit?: string;
    notifications_enabled?: boolean;
    preferences?: any;
    financial_year?: string;
    currency?: string;
    tax_settings?: any;
    invoice_format?: string;
    payment_terms?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
    user_id: 0,
    default_project_id: 1,
    unit: 'Kg',
    notifications_enabled: true,
    preferences: {
        unit_system: 'Metric',
        length_unit: 'Meter',
        email_alerts: true,
        sms_alerts: false,
        dsr_reminders: true,
        issue_alerts: true,
        material_alerts: true,
        language: 'English',
        timezone: 'IST (UTC+5:30)',
        date_format: 'DD/MM/YYYY',
        auto_save: true,
        compact_view: false,
        weather_widget: true,
        auto_gps: true
    },
    financial_year: '2026',
    currency: 'INR',
    tax_settings: {},
    invoice_format: 'standard',
    payment_terms: 'net30'
};

export const DEFAULT_PROFILE: UserProfile = {
    full_name: 'Amit Patil',
    designation: 'Site Engineer',
    email: 'amitpatil123@gmail.com',
    mobile: '7474747474',
    pan_number: 'ABCDE1234F',
    aadhaar_number: '1234-5678-9012',
    role: 'SiteEngineer',
    joining_date: '15-06-2024',
    address: 'Pune, Maharashtra',
    account_active: true,
    avatar_url: ''
};

export const settingsService = {
    // 1. GET /api/v1/settings - Get Settings
    getSettings: async (): Promise<AppSettings> => {
        try {
            const response = await api.get('/settings');
            return response.data;
        } catch (error: any) {
            console.error('GET /settings error:', error.response?.data || error.message);
            throw error;
        }
    },

    // 2. PUT /api/v1/settings - Update Settings
    updateSettings: async (settingsData: AppSettings) => {
        try {
            const response = await api.put('/settings', settingsData);
            return response.data;
        } catch (error: any) {
            console.error('PUT /settings error:', error.response?.data || error.message);
            throw error;
        }
    },

    // 3. GET /api/v1/settings/profile - Get Profile
    getProfile: async (): Promise<UserProfile> => {
        try {
            const response = await api.get('/settings/profile');
            return response.data;
        } catch (error: any) {
            console.error('GET /settings/profile error:', error.response?.data || error.message);
            throw error;
        }
    },

    // 4. PUT /api/v1/settings/profile - Update Profile
    updateProfile: async (profileData: UserProfile & { remove_profile_image?: boolean; profile_image?: any }) => {
        try {
            const formData = new FormData();
            
            // Append all valid string fields
            if (profileData.full_name !== undefined) formData.append('full_name', profileData.full_name);
            if (profileData.address !== undefined) formData.append('address', profileData.address);
            if (profileData.pan_number !== undefined) formData.append('pan_number', profileData.pan_number);
            if (profileData.aadhaar_number !== undefined) formData.append('aadhaar_number', profileData.aadhaar_number);
            if (profileData.designation !== undefined) formData.append('designation', profileData.designation);
            if (profileData.joining_date !== undefined) formData.append('joining_date', profileData.joining_date);
            
            // Append file if exists
            if (profileData.profile_image) {
                formData.append('profile_image', profileData.profile_image);
            }
            
            // Append boolean flag
            if (profileData.remove_profile_image !== undefined) {
                formData.append('remove_profile_image', String(profileData.remove_profile_image));
            }

            const response = await api.put('/settings/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('PUT /settings/profile error:', error.response?.data || error.message);
            throw error;
        }
    },

    // 5. POST /api/v1/settings/upload-logo - Upload Logo
    uploadLogo: async (fileData: any) => {
        try {
            const formData = new FormData();
            formData.append('logo', fileData);
            const response = await api.post('/settings/upload-logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('POST /settings/upload-logo error:', error.response?.data || error.message);
            throw error;
        }
    },
};
