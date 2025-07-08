// src/components/Profile.tsx
import React, { useEffect, useState } from "react";
import { requestProfile } from "../lib/api/profile-api";

const Profile: React.FC = () => {
  const { PROFILE } = requestProfile();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PROFILE()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-white font-bold">
          <img
            src="https://cdn2.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-512.png"
            alt=""
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {profile.full_name}
        </h1>
        <p className="text-gray-600 mt-1">Email: {profile.email}</p>
        {/* Add more profile fields here as needed */}
      </div>
    </div>
  );
};

export default Profile;
