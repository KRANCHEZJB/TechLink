const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    
    return response.json();
  },

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  async getEvents() {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },
  
  async getUpcomingEvents() {
    const response = await fetch(`${API_BASE_URL}/events/upcoming`);
    if (!response.ok) throw new Error('Failed to fetch upcoming events');
    return response.json();
  },
  
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },
  
  async getOrganizations() {
    const response = await fetch(`${API_BASE_URL}/organizations`);
    if (!response.ok) throw new Error('Failed to fetch organizations');
    return response.json();
  },

  async registerForEvent(eventId: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ eventId, userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register for event');
    }
    
    return response.json();
  },
};

export default api;
