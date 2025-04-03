import { create } from "zustand";
import { StateCreator } from "zustand";

interface UserData {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface UserState {
  user: UserData;
  users: UserData[];
  setUser: (user: UserData) => void;
  addUser: () => void;
}

const store: StateCreator<UserState> = (set) => ({
  user: {
    key: "",
    name: "",
    age: 0,
    address: "",
  },
  users: [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Joe Black",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Jim Green",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "4",
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
    },
    {
      key: "5",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "6",
      name: "Joe Black",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "7",
      name: "Jim Green",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "8",
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
    },
  ],
  setUser: (user) => set(() => ({ user })),
  addUser: () =>
    set((state) => ({
      users: [...state.users, state.user],
    })),
});

export const useUserState = create(store);
