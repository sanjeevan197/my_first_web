import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 API Request with JWT Token:', {
      endpoint: config.url,
      method: config.method?.toUpperCase(),
      token: token.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
  }
  return config;
});

export const nadiAPI = {
  saveUser: async (userData: { uid: string; email: string; displayName?: string }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users', userData);
      console.log('✅ User saved to database:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to save user:', error);
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/all');
      console.log('✅ Retrieved users:', response.data.length);
      return response;
    } catch (error) {
      console.error('❌ Failed to get users:', error);
      return { data: [] };
    }
  },
  getProfile: async (uid: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/${uid}/profile`);
      console.log('✅ Profile retrieved:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to get profile:', error);
      return { data: { profile: null } };
    }
  },
  updateProfile: async (uid: string, profileData: any) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/users/${uid}/profile`, profileData);
      console.log('✅ Profile updated:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update profile:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || 'Server error occurred';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },
  deleteProfile: async (uid: string) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/users/${uid}/profile`);
      console.log('✅ Profile deleted:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to delete profile:', error);
      throw error;
    }
  },
  guestLogin: async (email: string) => {
    try {
      return await axios.post('http://localhost:3001/api/guest-login', { email });
    } catch (error) {
      console.warn('Guest login failed:', error);
      throw error;
    }
  },
  getUserDetails: async (userId: string) => {
    try {
      return await axios.get(`http://localhost:3001/api/user/${userId}/details`);
    } catch (error) {
      console.warn('Failed to get user details:', error);
      return { data: { user: null, reports: [] } };
    }
  },
  startAnalysis: async () => {
    try {
      return await api.post('/nadi/start');
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return { data: { status: 'mock' } };
    }
  },
  analyzeWaveform: async (waveformData: number[]) => {
    try {
      return await api.post('/nadi/analyze', { waveform: waveformData });
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return { 
        data: { 
          vata: Math.floor(Math.random() * 30) + 30,
          pitta: Math.floor(Math.random() * 30) + 25,
          kapha: Math.floor(Math.random() * 30) + 25,
          status: 'Mock analysis complete'
        } 
      };
    }
  },
  getReports: async (userId: string) => {
    try {
      return await api.get(`/reports/${userId}`);
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return { data: [] };
    }
  },
};

export default api;