import { create } from "zustand";

type DeleteDialogState = {
  isOpen: boolean;
  userId: string | null;
  userName: string;
  openDialog: (id: string, name: string) => void;
  closeDialog: () => void;
};

export const useUserDeleteDialog = create<DeleteDialogState>((set) => ({
  isOpen: false,
  userId: null,
  userName: "",
  openDialog: (id, name) => set({ isOpen: true, userId: id, userName: name }),
  closeDialog: () => set({ isOpen: false, userId: null, userName: "" }),
}));
