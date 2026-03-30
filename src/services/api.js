import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const collegeService = {
    // Create a new college
    create: async (data) => {
        try {
            // Use multipart/form-data if data contains file
            const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
            const response = await api.post('colleges/', data, { headers });
            return response.data;
        } catch (error) {
            console.error("Error creating college:", error);
            throw error;
        }
    },

    // Get all colleges
    getAll: async () => {
        try {
            const response = await api.get('colleges/');
            return response.data;
        } catch (error) {
            console.error("Error fetching colleges:", error);
            throw error;
        }
    },

    // Get single college
    getById: async (id) => {
        try {
            const response = await api.get(`colleges/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching college ${id}:`, error);
            throw error;
        }
    },

    // Get detailed college info (mocking missing data for now)
    getDetail: async (id) => {
        try {
            const response = await api.get(`colleges/${id}/`);
            // We can chain this to fetch reviews separately if needed, 
            // but for now let's just return the college data and assume reviews are handled separately 
            // or we can attach reviews here if we want a composite object
            // Let's fetch reviews for this college too
            const reviewsResponse = await api.get(`reviews/?college=${id}`);

            return {
                ...response.data,
                reviews: reviewsResponse.data
            };
        } catch (error) {
            console.error(`Error fetching college detail ${id}:`, error);
            throw error;
        }
    },

    // Update college details
    update: async (id, data) => {
        try {
            // Use multipart/form-data if data contains file (image)
            const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
            const response = await api.patch(`colleges/${id}/`, data, { headers });
            return response.data;
        } catch (error) {
            console.error(`Error updating college ${id}:`, error);
            throw error;
        }
    }
};

export const reviewService = {
    create: async (data) => {
        const response = await api.post('reviews/', data);
        return response.data;
    },

    getByCollege: async (collegeId) => {
        const response = await api.get(`reviews/?college=${collegeId}`);
        return response.data;
    }
};



export const authService = {
    login: async (username, password) => {
        const response = await api.post('users/login/', { username, password });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('users/register/', userData);
        return response.data;
    },
    studentRegister: async (formData) => {
        const response = await api.post('users/student-register/', formData, {
            headers: { 'Content-Type': undefined } // Force Axios to calculate multipart boundary
        });
        return response.data;
    }
};

export const galleryService = {
    upload: async (formData) => {
        const response = await api.post('colleges/gallery/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getByCollege: async (collegeId, category = null) => {
        let url = `colleges/gallery/?college=${collegeId}`;
        if (category) {
            url += `&category=${category}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`colleges/gallery/${id}/`);
        return response.data;
    }
};

export default api;
