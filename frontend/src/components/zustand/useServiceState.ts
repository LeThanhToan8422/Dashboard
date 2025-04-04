import { create } from "zustand";
import { StateCreator } from "zustand";

interface ServiceData {
  key: string;
  name: string;
  duration: string;
  status: "active" | "inactive";
  image: string;
}

interface ServiceState {
  service: ServiceData;
  services: ServiceData[];
  currentFeature: string;
  setService: (service: ServiceData) => void;
  addService: () => void;
  updateService: () => void;
  deleteService: () => void;
}

const store: StateCreator<ServiceState> = (set) => ({
  service: {
    key: "",
    name: "",
    duration: "",
    status: "inactive",
    image: "",
  },
  services: [
    {
      key: "1",
      name: "Service 1",
      duration: "2 hours",
      status: "active",
      image: "https://picsum.photos/50",
    },
    {
      key: "2",
      name: "Service 2",
      duration: "1 hour",
      status: "inactive",
      image: "https://picsum.photos/50",
    },
  ],
  currentFeature: "create",
  setService: (service) => set(() => ({ service })),
  addService: () =>
    set((state) => ({
      services: [...state.services, state.service],
    })),
  updateService: () =>
    set((state) => ({
      services: [
        ...state.services.filter((s) => s.key !== state.service.key),
        state.service,
      ],
    })),
  deleteService: () =>
    set((state) => ({
      services: state.services.filter((s) => s.key !== state.service.key),
    })),
});

export const useServiceState = create(store);
