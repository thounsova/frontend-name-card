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

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile</p>;
  return (
    <div className="flex   gap-4 p-4 border border-gray-300 rounded-md max-w-md">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwiVqpNd0zv349lznWpZI0-KKoEyp-sFiA_g&s"
        alt="User Avatar"
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-400"
      />
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Name: {data?.user_name || "No name"}
        </h1>
        <p className="text-gray-600">Email: {data?.email || "No email"}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Profile />
      </div>
    </QueryClientProvider>
  );
}
