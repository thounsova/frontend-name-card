// import { create } from "zustand";
// import { devtools } from "zustand/middleware";
// import Cookies from "js-cookie";
// import { clearTokens } from "@/lib/cookie";
// import { CookieName } from "@/types";
// import { jwtDecode } from "jwt-decode";

// interface JwtPayload {
//   roles: string[];
// }

// interface AuthState {
//   accessToken: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   roles: string[];
//   setTokens: (
//     // accessToken: string,
//     // refreshToken: string,
//     roles: string[]
//   ) => void;
//   checkAuth: () => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   devtools(
//     (set) => ({
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: !!Cookies.get(CookieName.ACCESS_TOKEN),
//       roles: [],

//       /**
//        * ✅ Called after successful login
//        */
//       setTokens: (roles) => {
//         // Cookies.set(CookieName.ACCESS_TOKEN, accessToken);
//         // Cookies.set(CookieName.REFRESH_TOKEN, refreshToken);

//         set(
//           {
//             // accessToken,
//             // refreshToken,
//             roles,
//             isAuthenticated: true,
//           },
//           false,
//           "auth/setTokens"
//         );
//       },

//       /**
//        * ✅ Called on app load or refresh to rehydrate from cookies
//        */
//       checkAuth: async () => {
//         const access = Cookies.get(CookieName.ACCESS_TOKEN);
//         const refresh = Cookies.get(CookieName.REFRESH_TOKEN);

//         const isAuth = !!access && !!refresh;

//         if (isAuth) {
//           let roles = [];
//           const decoded = jwtDecode<JwtPayload>(access);
//           roles = decoded.roles || [];

//           try {
//             set(
//               {
//                 accessToken: access || null,
//                 refreshToken: refresh || null,
//                 isAuthenticated: isAuth,
//                 roles, // 🚨 You can fetch user profile if needed to restore roles here
//               },
//               false,
//               "auth/checkAuth"
//             );
//             // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           } catch (error) {
//             console.error("Failed to fetch profile");
//             set({
//               accessToken: null,
//               refreshToken: null,
//               isAuthenticated: false,
//               roles: [],
//             });
//           }
//         } else {
//           set({
//             accessToken: null,
//             refreshToken: null,
//             isAuthenticated: false,
//             roles: [],
//           });
//         }
//       },

//       /**
//        * Clears state + cookies and redirects
//        */
//       logout: () => {
//         clearTokens();
//         set(
//           {
//             accessToken: null,
//             refreshToken: null,
//             isAuthenticated: false,
//             roles: [],
//           },
//           false,
//           "auth/logout"
//         );
//         // window.location.href = "/login";
//       },
//     }),
//     { name: "AuthStore" }
//   )
// );

// src/store/auth-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
import { clearTokens } from "@/lib/cookie";
import { CookieName } from "@/types";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  roles: string[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  roles: string[];
  hydrated: boolean; // ✅ to check if auth is loaded
  setTokens: (roles: string[]) => void;
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

      setTokens: (roles) => {
        set(
          {
            roles,
            isAuthenticated: true,
          },
          false,
          "auth/setTokens"
        );
      },

      checkAuth: () => {
        const access = Cookies.get(CookieName.ACCESS_TOKEN);
        const refresh = Cookies.get(CookieName.REFRESH_TOKEN);
        console.log(access, "===access===");
        const isAuth = !!access && !!refresh;

        if (isAuth) {
          try {
            const decoded = jwtDecode<JwtPayload>(access!);
            const roles = decoded.roles || [];

            set(
              {
                accessToken: access,
                refreshToken: refresh,
                isAuthenticated: true,
                roles,
                hydrated: true,
              },
              false,
              "auth/checkAuth"
            );
          } catch (error) {
            console.error("JWT decode failed", error);
            set({
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              roles: [],
              hydrated: true,
            });
          }
        } else {
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            roles: [],
            hydrated: true,
          });
        }
      },

      logout: () => {
        clearTokens();
        set(
          {
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            roles: [],
            hydrated: true,
          },
          false,
          "auth/logout"
        );
      },
    }),
    { name: "AuthStore" }
  )
);
