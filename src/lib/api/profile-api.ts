import request from "@/lib/api/request";
import type { IProfileResponse } from "@/types/profile-type";
export const requestProfile = () => {
  const PROFILE = async (): Promise<IProfileResponse> => {
    console.log("======Fetching user profile...");
    try {
      const response = await request({
        url: "/user/me",
        method: "GET",
      });
      // Assuming your response wraps data inside a `data` property:
      return response.data ?? response;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  };

  return { PROFILE };
};
