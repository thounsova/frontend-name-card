import { create } from "zustand";
import type { IUser } from "@/types/user-type";

type State = {
  isOpen: boolean;
  user: IUser | null;
  openModal: (user: IUser) => void;
  closeModal: () => void;
};

export const useUserEditModal = create<State>((set) => ({
  isOpen: false,
  user: null,
  openModal: (user) => set({ isOpen: true, user }),
  closeModal: () => set({ isOpen: false, user: null }),
}));
