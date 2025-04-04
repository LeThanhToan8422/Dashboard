import axios from "axios";

const API_URL = "https://dummyjson.com/auth";

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  getCurrentUser: async (accessToken: string) => {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  refreshToken: async (refreshToken?: string, expiresInMins?: number) => {
    const response = await axios.post<RefreshResponse>(
      `${API_URL}/refresh`,
      {
        refreshToken,
        expiresInMins,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};

export default authService;
