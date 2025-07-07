import request from "@/lib/api/request";

export const requestAuth = () => {
  const LOGOUT = async () => {
    try {
      return await request({
        url: "/auth/logout",
        method: "POST", // usually logout is POST, adjust if needed
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return { LOGOUT };
};
