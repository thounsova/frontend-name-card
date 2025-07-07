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
    <div>
      <h1>{profile.full_name}</h1>
      <p>Email: {profile.email}</p>
      {/* Add other fields you want to display */}
    </div>
  );
};

export default Profile;
