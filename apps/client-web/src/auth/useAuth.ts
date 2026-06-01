import { useState } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginDto): Promise<LoginResponse> => {
    setIsLoading(true);
    
    try {
      // Mock login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: LoginResponse = {
        user: {
          id: '1',
          email: data.email,
          role: 'user',
          name: 'Test User'
        },
        token: 'mock-jwt-token'
      };
      
      // Store token in localStorage
      localStorage.setItem('auth_token', mockResponse.token);
      
      return mockResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading
  };
}
