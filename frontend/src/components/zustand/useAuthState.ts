import { create } from "zustand";
import { StateCreator } from "zustand";
import authService, {
  AuthResponse,
  LoginCredentials,
} from "../../services/authService";

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

const store: StateCreator<AuthState> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      set({ user: response, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Login failed", isLoading: false });
    }
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false, error: null });
  },
  getCurrentUser: async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getCurrentUser(accessToken);
      set({ user: response, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to get current user", isLoading: false });
    }
  },
});

export const useAuthState = create(store);
