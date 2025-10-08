import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with automatic token attachment
const authAPI = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach Firebase token to all requests
authAPI.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Request authenticated for:', user.email);
    } catch (error) {
      console.error('❌ Failed to get auth token:', error);
    }
  }
  return config;
});

// Handle authentication errors
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 Authentication failed');
    } else if (error.code === 'ECONNREFUSED' || !error.response) {
      console.error('🚫 Server connection failed');
      error.message = 'No response from server. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const perfectAuthAPI = {
  // Sync user with local database after Firebase auth
  syncUser: async (userData: {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified?: boolean;
    provider?: string;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/sync`, userData);
      console.log('✅ User synced with database:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to sync user:', error);
      throw error;
    }
  },

  // Get user profile (authenticated)
  getProfile: async (uid: string) => {
    try {
      const response = await authAPI.get(`/users/${uid}/profile`);
      console.log('✅ Profile retrieved:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to get profile:', error);
      throw error;
    }
  },

  // Update user profile (authenticated)
  updateProfile: async (uid: string, profileData: any) => {
    try {
      const response = await authAPI.put(`/users/${uid}/profile`, profileData);
      console.log('✅ Profile updated:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      throw error;
    }
  },

  // Get all users (authenticated, admin only)
  getAllUsers: async () => {
    try {
      const response = await authAPI.get('/users/all');
      console.log('✅ Retrieved all users:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Failed to get users:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ Server health:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },

  // Verify authentication status
  verifyAuth: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const token = await user.getIdToken();
      console.log('✅ Authentication verified for:', user.email);
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        token
      };
    } catch (error) {
      console.error('❌ Authentication verification failed:', error);
      throw error;
    }
  }
};

export default authAPI;