import { api } from './api';

export interface CreateUserData {
    full_name: string;
    mobile_number: string;
    email: string;
    role: "Admin" | "ProjectManager" | "SiteEngineer" | "Accountant" | "Client";
    password: string;
    designation?: string;
    joining_date?: string; // YYYY-MM-DD
    pan_number?: string;
    aadhaar_number?: string;
    address?: string;
    is_active?: boolean;
}

export const userService = {
    /**
     * Creates a new user.
     * Due to backend requirements, text data is sent as query params and the image is sent as a multipart/form-data body.
     */
    createUser: async (userData: CreateUserData, profileImageUri?: string) => {
        try {
            // Apply default value for is_active if not provided
            const params = {
                ...userData,
                is_active: userData.is_active !== undefined ? userData.is_active : true,
            };

            const formData = new FormData();

            if (profileImageUri) {
                // Get filename from uri
                const filename = profileImageUri.split('/').pop() || 'profile.jpg';

                // Infer type from extension
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                // React Native specific fetch/axios FormData structure for files
                formData.append('profile_image', {
                    uri: profileImageUri,
                    name: filename,
                    type,
                } as any);
            }

            const response = await api.post('/users/create', formData, {
                params,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
};
