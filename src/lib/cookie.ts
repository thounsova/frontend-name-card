import Cookies from "js-cookie";

export const CookieName = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

export function clearTokens() {
  Cookies.remove(CookieName.ACCESS_TOKEN);
  Cookies.remove(CookieName.REFRESH_TOKEN);
}
