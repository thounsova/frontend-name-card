"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { requestProfile } from "@/lib/api/profile-api";

const queryClient = new QueryClient();

function Profile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: requestProfile,
  });

  if (isLoading)
    return (
      <p className="text-orange-600 text-xl font-semibold">Loading profile...</p>
    );
  if (error)
    return (
      <p className="text-red-600 text-xl font-semibold">Error loading profile</p>
    );

  return (
    <div className="flex flex-col w-full items-center p-10 max-w-lg bg-white rounded-2xl shadow-lg border border-orange-300">
      {/* Avatar */}
      <img
        src={
          data?.avatar ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwiVqpNd0zv349lznWpZI0-KKoEyp-sFiA_g&s"
        }
        alt="User Avatar"
        className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 mb-8 shadow-md"
      />

      {/* Name */}
      <h1 className="text-4xl font-extrabold text-orange-700 mb-4">
        {data?.full_name || "No Full Name"}
      </h1>

      {/* Username */}
      <p className="text-lg text-gray-700 mb-2">
        <span className="font-semibold text-orange-600">Username:</span>{" "}
        {data?.user_name || "N/A"}
      </p>

      {/* Email */}
      <p className="text-lg text-gray-700 mb-2">
        <span className="font-semibold text-orange-600">Email:</span>{" "}
        {data?.email || "N/A"}
      </p>

      {/* Roles */}
      <p className="text-lg text-gray-700 mb-2">
        <span className="font-semibold text-orange-600">Role:</span>{" "}
        {data?.roles?.join(", ") || "No role"}
      </p>

      {/* Active Status */}
      <p className="text-lg text-gray-700 mb-2">
        <span className="font-semibold text-orange-600">Active:</span>{" "}
        {/* {data?.is_active ? (
          <span className="text-green-600 font-bold">Yes</span>
        ) : (
          <span className="text-red-600 font-bold">No</span>
        )} */}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-center min-h-screen bg-orange-50 p-6">
        <Profile />
      </div>
    </QueryClientProvider>
  );
}
