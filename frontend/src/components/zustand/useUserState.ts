import { create } from "zustand";
import { StateCreator } from "zustand";
import axios from "axios";
import { Dayjs } from "dayjs";
import { UploadFile } from "antd/es/upload/interface";

interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
}

interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

interface Hair {
  color: string;
  type: string;
}

export interface UserData {
  key: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string | Dayjs;
  image: string | UploadFile[];
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  address: Address;
  university?: string;
  company: Company;
  role: "admin" | "moderator" | "user";
}

interface UserState {
  user: UserData;
  users: UserData[];
  currentFeature: "create" | "update" | "view" | "delete" | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserData) => void;
  resetUser: () => void;
  fetchUsers: () => Promise<void>;
  addUser: () => void;
  updateUser: () => void;
  deleteUser: () => void;
}

interface ApiResponse {
  users: Array<UserData & { id: number }>;
  total: number;
  skip: number;
  limit: number;
}

const initUserValues: UserData = {
  key: "",
  firstName: "",
  lastName: "",
  age: 0,
  gender: "",
  email: "",
  phone: "",
  username: "",
  birthDate: "",
  image: "",
  bloodGroup: "",
  height: 0,
  weight: 0,
  eyeColor: "",
  hair: {
    color: "",
    type: "",
  },
  address: {
    address: "",
    city: "",
    state: "",
    stateCode: "",
    postalCode: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    country: "",
  },
  company: {
    department: "",
    name: "",
    title: "",
    address: {
      address: "",
      city: "",
      state: "",
      stateCode: "",
      postalCode: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
      country: "",
    },
  },
  role: "user" as const,
};

const store: StateCreator<UserState> = (set) => ({
  user: initUserValues,
  users: [],
  currentFeature: null,
  isLoading: false,
  error: null,
  setUser: (user) => set(() => ({ user })),
  resetUser: () =>
    set(() => ({
      user: initUserValues,
    })),
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<ApiResponse>(
        "https://dummyjson.com/users"
      );
      const formattedUsers = response.data.users.map((user) => ({
        ...user,
        key: user.id.toString(),
      }));
      set({ users: formattedUsers, isLoading: false });
    } catch (err) {
      console.log(err);
      set({ error: "Failed to fetch users", isLoading: false });
    }
  },
  addUser: () =>
    set((state) => {
      console.log(state.user);
      return {
        users: [
          ...state.users,
          {
            ...state.user,
            image: `https://picsum.photos/${Math.floor(Math.random() * 1000)}`,
          },
        ],
      };
    }),
  updateUser: () =>
    set((state) => ({
      users: state.users.map((u) =>
        u.key === state.user.key ? state.user : u
      ),
    })),
  deleteUser: () =>
    set((state) => ({
      users: state.users.filter((u) => u.key !== state.user.key),
      user: state.user,
      currentFeature: null,
    })),
});

export const useUserState = create(store);
