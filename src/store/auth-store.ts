import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
import { clearTokens } from "@/lib/cookie";
import { CookieName } from "@/types";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  roles: string[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  roles: string[];
  hydrated: boolean; // To track if auth is loaded
  setTokens: (accessToken: string, refreshToken: string) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      roles: [],
      hydrated: false,

      setTokens: (accessToken: string, refreshToken: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          const roles = decoded.roles || [];

          set({
            accessToken,
            refreshToken,
            roles,
            isAuthenticated: true,
            hydrated: true,
          });
        } catch (error) {
          console.error("JWT decode failed", error);
          set({
            accessToken: null,
            refreshToken: null,
            roles: [],
            isAuthenticated: false,
            hydrated: true,
          });
        }
      },

      checkAuth: () => {
        const access = Cookies.get(CookieName.ACCESS_TOKEN);
        const refresh = Cookies.get(CookieName.REFRESH_TOKEN);

        if (access && refresh) {
          try {
            const decoded = jwtDecode<JwtPayload>(access);
            const roles = decoded.roles || [];

            set({
              accessToken: access,
              refreshToken: refresh,
              roles,
              isAuthenticated: true,
              hydrated: true,
            });
          } catch (error) {
            console.error("JWT decode failed", error);
            set({
              accessToken: null,
              refreshToken: null,
              roles: [],
              isAuthenticated: false,
              hydrated: true,
            });
          }
        } else {
          set({
            accessToken: null,
            refreshToken: null,
            roles: [],
            isAuthenticated: false,
            hydrated: true,
          });
        }
      },

      logout: () => {
        clearTokens();
        set({
          accessToken: null,
          refreshToken: null,
          roles: [],
          isAuthenticated: false,
          hydrated: true,
        });
      },
    }),
    { name: "AuthStore" }
  )
);
