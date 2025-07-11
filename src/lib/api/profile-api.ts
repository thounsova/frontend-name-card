import request from "@/lib/api/request";
import type { IProfileResponse } from "@/types/profile-type";

export const requestProfile = async (): Promise<IProfileResponse> => {
  console.log("======Fetching user profile...");
  try {
    const response = await request({
      url: "/user/me",
      method: "GET",
    });
    return response.data.data ?? response.data ?? response;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};
