// ========================================
// API HELPER FOR BACKEND COMMUNICATION
// ========================================
// This utility handles all API calls to the backend with authentication

import { isValidObjectId } from "./objectId";

// Determine the correct environment variable based on your bundler
const API_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:5000/api';

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Get current user from localStorage
export const getCurrentUser = (): any | null => {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/';
};

// Create headers with auth token
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call helper with authentication
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_URL}${endpoint}`;
  const headers = getAuthHeaders();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Token expired or invalid
        console.warn('Authentication failed - token expired or invalid');
        logout();
        throw new Error('Session expired. Please login again.');
      }
      
      // Handle ID validation errors (400 Bad Request for invalid ObjectId)
      if (response.status === 400 && data.error === 'Invalid ID format') {
        console.error('Invalid MongoDB ObjectId:', data.message);
        throw new Error('Invalid ID format. Please refresh the page and try again.');
      }
      
      // Handle other errors
     throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

// ========================================
// API METHODS
// ========================================

export const api = {
  // ========================================
  // AUTHENTICATION
  // ========================================
  
  /**
   * Login with Google OAuth
   * @param credential - Google ID token
   */
  googleLogin: (credential: string) => 
    apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential })
    }),

  /**
   * Sign up with email and password
   */
  signup: (email: string, password: string, name: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    }),

  /**
   * Sign in with email and password
   */
  signin: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  /**
   * Verify current token
   */
  verifyToken: () => apiCall('/auth/verify'),

  // ========================================
  // HOME SECTION
  // ========================================
  
  getHome: () => apiCall('/home'),
  
  updateHome: (data: any) => apiCall('/home', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  

    getStats: () => apiCall('/awards/stats'),

  updateStats: (data: any) => apiCall('/awards/stats', {
    method: 'PUT',
    body: JSON.stringify({ stats: data })
  }),
  // ========================================
  // AWARDS SECTION
  // ========================================
  
  getAwards: () => apiCall('/awards'),
  
  createAward: (data: any) => apiCall('/awards', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  updateAward: (id: string, data: any) => apiCall(`/awards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  deleteAward: (id: string) => apiCall(`/awards/${id}`, {
    method: 'DELETE'
  }),


    getFeaturedAwards: () => apiCall('/featured-awards'),

  createFeaturedAward: (data: any) => apiCall('/featured-awards', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateFeaturedAward: (id: string, data: any) => apiCall(`/featured-awards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteFeaturedAward: (id: string) => apiCall(`/featured-awards/${id}`, {
    method: 'DELETE'
  }),

  // ========================================
  // NEWS SECTION
  // ========================================
  getNews: () => apiCall('/news'),

updateAllNews: (data: any) => apiCall('/news/all', {
  method: 'PUT',
  body: JSON.stringify(data)
}),

// Article CRUD
createArticle: (data: any) => apiCall('/news/article', {
  method: 'POST',
  body: JSON.stringify(data)
}),
updateArticle: (id: string, data: any) => apiCall(`/news/article/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
}),
deleteArticle: (id: string) => apiCall(`/news/article/${id}`, {
  method: 'DELETE'
}),

// Video CRUD
createVideo: (data: any) => apiCall('/news/video', {
  method: 'POST',
  body: JSON.stringify(data)
}),
updateVideo: (id: string, data: any) => apiCall(`/news/video/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
}),
deleteVideo: (id: string) => apiCall(`/news/video/${id}`, {
  method: 'DELETE'
}),

// Story CRUD
createStory: (data: any) => apiCall('/news/story', {
  method: 'POST',
  body: JSON.stringify(data)
}),
updateStory: (id: string, data: any) => apiCall(`/news/story/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
}),
deleteStory: (id: string) => apiCall(`/news/story/${id}`, {
  method: 'DELETE'
}),


  // ========================================
  // EVENTS SECTION
  // ========================================
  
  getEvents: () => apiCall('/events'),
  
  createEvent: (data: any) => apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  updateEvent: (id: string, data: any) => apiCall(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  deleteEvent: (id: string) => apiCall(`/events/${id}`, {
    method: 'DELETE'
  }),

  // ========================================
  // PUBLICATIONS SECTION
  // ========================================
  
  getPublications: () => apiCall('/publications'),
  
  createPublication: (data: any) => apiCall('/publications', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  updatePublication: (id: string, data: any) => apiCall(`/publications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  deletePublication: (id: string) => apiCall(`/publications/${id}`, {
    method: 'DELETE'
  }),

  // ========================================
  // COMMUNITY SECTION
  // ========================================
  
 getCommunity: () => apiCall('/community'),

updateCommunity: (data: any) => apiCall('/community', {
  method: 'PUT',
  body: JSON.stringify(data)
}),


  // ========================================
  // CONTACT SECTION
  // ========================================
  
  getContact: () => apiCall('/contact'),

createContact: (data: any) => apiCall('/contact', {
  method: 'POST',
  body: JSON.stringify(data)
}),

updateContact: (data: any) => apiCall('/contact', {
  method: 'PUT',
  body: JSON.stringify(data)
}),


deleteContact: (id: string) => apiCall(`/contact/${id}`, {
  method: 'DELETE'
}),

submitContactForm: (data: any) => apiCall('/contact/submit', {
  method: 'POST',
  body: JSON.stringify(data)
}),

  // ========================================
  // MISSION SECTION
  // ========================================
  
  getMission: () => apiCall('/mission'),
  
  updateMission: (data: any) => apiCall('/mission', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // ========================================
  // THEME SETTINGS
  // ========================================
  
  getTheme: () => apiCall('/theme'),
  
  updateTheme: (data: any) => apiCall('/theme', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // ========================================
  // SEO SETTINGS
  // ========================================
  
  getSEO: () => apiCall('/seo'),
  
  updateSEO: (data: any) => apiCall('/seo', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // ========================================
  // FILE UPLOAD (For Cloudinary integration)
  // ========================================
  
  /**
   * Upload file to cloud storage
   * @param file - File to upload
   * @param type - Type of file (image/video)
   */
  uploadFile: async (file: File, type: 'image' | 'video' = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = getAuthToken();
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'File upload failed');
    }

    return data;
  }
};



export default api;