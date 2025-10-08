import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const restAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
restAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Server not available. Please start the backend server.';
    }
    return Promise.reject(error);
  }
);

export const nadiRestAPI = {
  // GET /api/users - Get all users
  getAllUsers: async () => {
    try {
      const response = await restAPI.get('/users');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get users:', error);
      throw error;
    }
  },

  // GET /api/users/:id - Get single user
  getUser: async (id: string) => {
    try {
      const response = await restAPI.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get user:', error);
      throw error;
    }
  },

  // POST /api/users - Create user
  createUser: async (userData: {
    id: string;
    email: string;
    display_name?: string;
    phone?: string;
    age?: number;
    address?: string;
  }) => {
    try {
      const response = await restAPI.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create user:', error);
      throw error;
    }
  },

  // PUT /api/users/:id - Update user (full update)
  updateUser: async (id: string, userData: {
    display_name?: string;
    phone?: string;
    age?: number;
    address?: string;
  }) => {
    try {
      const response = await restAPI.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update user:', error);
      throw error;
    }
  },

  // PATCH /api/users/:id - Partial update
  patchUser: async (id: string, updates: Record<string, any>) => {
    try {
      const response = await restAPI.patch(`/users/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to patch user:', error);
      throw error;
    }
  },

  // DELETE /api/users/:id - Delete user
  deleteUser: async (id: string) => {
    try {
      const response = await restAPI.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete user:', error);
      throw error;
    }
  },

  // GET /api/health - Health check
  healthCheck: async () => {
    try {
      const response = await restAPI.get('/health');
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },
};

export default restAPI;