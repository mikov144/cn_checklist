// src/components/Form.tsx

import { useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function Form() {
  const [method, setMethod] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const route = method === "login" ? "/api/token/" : "/api/user/register/";

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      
      if (method === "register" && profilePicture) {
        formData.append("profile.profile_picture", profilePicture);
      }

      const res = await api.post(route, 
        method === "login" 
          ? { username, password }
          : formData,
        method === "register" 
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined
      );

      // Reset form on successful submission
      setUsername("");
      setPassword("");
      setProfilePicture(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        setMethod('login'); // Switch to login mode after successful registration
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const toggleMethod = () => {
    setMethod(method === 'login' ? 'register' : 'login');
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-synth-background bg-cover bg-center" style={{ backgroundImage: "url('/images/_main-background.webp')" }}>
      <form onSubmit={handleSubmit} className="bg-synth-background p-8 rounded-lg neon-border max-w-md w-full bg-gray-900/90">
        <h1 className="text-3xl font-retro neon-text text-synth-primary mb-6 text-center">{name}</h1>
        <input
          className="block w-full p-3 border border-synth-primary rounded mb-4 bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="block w-full p-3 border border-synth-primary rounded mb-4 bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {method === "register" && (
          <div className="mb-4">
            <label className="block text-synth-text mb-2">Choose a profile picture:</label>
            <div className="relative">
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
                  focus:outline-none
                  dark:file:bg-synth-primary/10"
              />
            </div>
          </div>
        )}
        {loading && <LoadingIndicator />}
        <button
          className="button-retro w-full py-3 rounded"
          type="submit"
        >
          {name}
        </button>
        <p className="text-center mt-4 text-synth-secondary neon-text">
          {method === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-synth-primary link-hover inline-block cursor-pointer"
            onClick={toggleMethod}
          >
            {method === "login" ? "Register here" : "Login here"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Form;