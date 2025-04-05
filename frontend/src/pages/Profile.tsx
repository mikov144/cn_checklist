// src/pages/Profile.tsx

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast.css';
import api from "../api";
import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";
import { useUser } from "../context/UserContext";
import Notification from "../helpers/notifications/Notification";
import { showNotification, toastType, parseErrorMessage } from "../helpers/notifications/notificationEmitter";

function Profile() {
  const { user, loading: userLoading, refreshUserData } = useUser();
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await refreshUserData();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
    };

    initializeUser();
  }, []); // Remove refreshUserData from dependencies to prevent re-runs

  // Update username when user data is loaded
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      showNotification("Both old and new passwords are required", toastType.error);
      return;
    }

    try {
      await api.put('/api/user/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });

      // Reset password fields
      setOldPassword("");
      setNewPassword("");
      
      showNotification("Password updated successfully!", toastType.success);
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      showNotification(errorMessage, toastType.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profilePicture) {
        formData.append("profile.profile_picture", profilePicture);
      }

      await api.put('/api/user/update/', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Reset file input
      setProfilePicture(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh user data
      await refreshUserData();
      
      showNotification("Profile updated successfully!", toastType.success);
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      showNotification(errorMessage, toastType.error);
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const clearProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (userLoading && !user) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-synth-background pl-2 pr-2 pt-2 bg-cover bg-center" style={{ backgroundImage: "url('/images/_main-background.webp')" }}>
      <Header />
      <Notification />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-gray-900/90 p-8 rounded-lg neon-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-500 shadow-lg mb-4">
              <img
                src={user?.profile.profile_picture || "/images/_default_pfp.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-4xl font-retro text-synth-primary neon-text">{user?.username}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-synth-text mb-2 text-2xl">New username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full p-3 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-xl"
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl text-synth-text">Change Password</h3>
              <div>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="block w-full p-3 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full p-3 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
                  placeholder="Enter your new password"
                />
              </div>
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={!oldPassword || !newPassword}
                className="button-retro w-full py-2 rounded text-lg disabled:opacity-50"
              >
                Update Password
              </button>
            </div>

            <div>
              <label className="block text-synth-text mb-2 text-xl">Change profile picture</label>
              <div className="flex gap-4 items-center">
                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="block w-full text-synth-text cursor-pointer
                      file:cursor-pointer
                      file:mr-4 file:py-2.5 file:px-8
                      file:rounded-md file:border-2
                      file:border-synth-primary
                      file:text-synth-primary
                      file:bg-synth-primary/5
                      file:font-retro
                      file:text-sm
                      file:shadow-[0_0_5px_rgba(139,92,246,0.3)]
                      file:transition-all
                      file:duration-300
                      file:ease-out
                      hover:file:text-pink-500
                      hover:file:border-synth-secondary
                      hover:file:bg-synth-primary/20
                      hover:file:shadow-[0_0_15px_rgba(139,92,246,0.6)]
                      active:file:bg-synth-primary/30
                      active:file:border-synth-secondary
                      active:file:text-pink-700
                      active:file:shadow-[0_0_20px_rgba(139,92,246,0.8)]
                      focus:outline-none"
                  />
                </div>
                {profilePicture && (
                  <button
                    type="button"
                    onClick={clearProfilePicture}
                    className="button-retro py-2.5 px-4 text-sm h-[42px] flex items-center justify-center min-w-[100px]"
                  >
                    Clear Image
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="button-retro w-full py-3 rounded disabled:opacity-50 text-xl"
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;