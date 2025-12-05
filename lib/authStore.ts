import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type AuthStore = {
  isAuthenticatedLocal: boolean;
  authenticateLocal: (password: string) => void;
};
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticatedLocal: false,
      authenticateLocal: (password) => {
        if (password === "314159") {
          set({ isAuthenticatedLocal: true });
        } else {
          set({ isAuthenticatedLocal: false });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
