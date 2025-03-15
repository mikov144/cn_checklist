import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";
import { useUser } from "../context/UserContext";

interface UserProfile {
  id: number;
  username: string;
  profile: {
    profile_picture: string | null;
  };
}

function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { refreshUserData } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/user/');
        setUser(response.data);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (password) {
        formData.append("password", password);
      }
      if (profilePicture) {
        formData.append("profile.profile_picture", profilePicture);
      }

      await api.put('/api/user/update/', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Reset password field and file input
      setPassword("");
      setProfilePicture(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh user data
      const response = await api.get('/api/user/');
      setUser(response.data);
      
      // Trigger header refresh
      refreshUserData();

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-synth-background pl-6 pr-6 pt-6 bg-cover bg-center" style={{ backgroundImage: "url('/images/_main-background.webp')" }}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-gray-900/90 p-8 rounded-lg neon-border">
          <div className="flex flex-col items-center mb-8">
            <img
              src={user?.profile.profile_picture || "/images/_default_pfp.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-synth-primary shadow-lg mb-4"
            />
            <h2 className="text-3xl font-retro text-synth-primary neon-text">{user?.username}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-synth-text mb-2 text-xl">New username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full p-3 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-synth-text mb-2 text-xl">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-3 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
              />
            </div>

            <div>
              <label className="block text-synth-text mb-2 text-xl">Change profile picture</label>
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
                  hover:file:text-white
                  hover:file:border-synth-secondary
                  hover:file:bg-synth-primary/20
                  hover:file:shadow-[0_0_15px_rgba(139,92,246,0.6)]
                  active:file:bg-synth-primary/30
                  active:file:border-synth-secondary
                  active:file:text-white
                  active:file:shadow-[0_0_20px_rgba(139,92,246,0.8)]
                  focus:outline-none"
              />
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