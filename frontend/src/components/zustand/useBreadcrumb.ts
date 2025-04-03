import { create } from "zustand";

interface breadcrumbI {
  title: string;
  href?: string;
}

interface storeI {
  breadcrumb: breadcrumbI[];
}

const store = (set: (fn: (state: storeI) => Partial<storeI>) => void, get) => ({
  breadcrumb: [],
});

export const useBreadcrumb = create(store);
