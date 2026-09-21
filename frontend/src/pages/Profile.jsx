import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { userService } from "../services/apiService";
import { formatDate } from "../utils/format";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await userService.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError(err.friendlyMessage || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      {loading && <LoadingSpinner label="Loading profile..." />}
      <ErrorMessage message={error} />

      {!loading && profile && (
        <div className="card profile-card">
          <div className="profile-avatar">{profile.fullName?.charAt(0)}</div>
          <div className="profile-details">
            <p className="profile-name">{profile.fullName}</p>
            <p className="muted">{profile.email}</p>
            <p className="muted small">Role: {profile.role}</p>
            <p className="muted small">
              Member since {formatDate(profile.createdAt)}
            </p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
