// src/components/Form.tsx

import { useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import FormNotification from "../helpers/notifications/FormNotification";
import { showNotification, toastType, parseErrorMessage } from "../helpers/notifications/notificationEmitter";

function Form() {
  const [method, setMethod] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const name = method === "login" ? "Login" : "Register";

  const validateForm = () => {
    let isValid = true;
    
    setUsernameError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (method === 'register' && password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    if (method === 'register' && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
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
      setConfirmPassword("");
      setProfilePicture(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        showNotification("Registration successful!", toastType.success);
        setMethod('login'); // Switch to login mode after successful registration
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      showNotification(errorMessage, toastType.error);
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
    setUsername("");
    setUsernameError(null);
    setPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setConfirmPasswordError(null);
    setProfilePicture(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const EyeIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322c1.91-4.308 5.812-7.322 9.964-7.322 4.152 0 8.054 3.014 9.964 7.322-1.91 4.308-5.812 7.322-9.964 7.322-4.152 0-8.054-3.014-9.964-7.322z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const EyeOffIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.04 7.037 19 12 19c1.658 0 3.22-.33 4.611-.923"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.04 15.777A10.45 10.45 0 0022.066 12C20.774 7.96 16.963 5 12 5a10.45 10.45 0 00-4.611.923"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.88 9.88a3 3 0 104.24 4.24"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-synth-background bg-cover bg-center" style={{ backgroundImage: "url('/images/_main-background.webp')" }}>
      <FormNotification />
      <form onSubmit={handleSubmit} className="bg-synth-background p-8 rounded-lg neon-border max-w-md w-full bg-gray-900/90">
        <h1 className="text-4xl font-retro neon-text text-synth-primary mb-6 text-center">{name}</h1>
        <input
          className="block w-full p-3 border border-synth-primary rounded mb-2 bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError(null);
          }}
          placeholder="Username"
          required
        />
        <p className={`h-5 text-red-400 text-sm mb-4 ml-1 transition-opacity duration-200 ${!usernameError ? "invisible" : ""}`}>
          {usernameError}
        </p>
        <div className="relative">
          <input
            className="block w-full p-3 pr-12 border border-synth-primary rounded mb-2 bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(null);
            }}
            placeholder="Password"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-synth-text/70 hover:text-synth-text active:text-synth-secondary cursor-pointer select-none transition duration-150 ease-out hover:scale-110 active:scale-95"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className={`h-5 text-red-400 text-sm mb-4 ml-1 transition-opacity duration-200 ${!passwordError ? "invisible" : ""}`}>
          {passwordError}
        </p>
        {method === "register" && (
          <>
            <div className="relative">
              <input
                className="block w-full p-3 pr-12 border border-synth-primary rounded mb-2 bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary text-lg"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(null);
                }}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-synth-text/70 hover:text-synth-text active:text-synth-secondary cursor-pointer select-none transition duration-150 ease-out hover:scale-110 active:scale-95"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className={`h-5 text-red-400 text-sm mb-4 ml-1 transition-opacity duration-200 ${!confirmPasswordError ? "invisible" : ""}`}>
              {confirmPasswordError}
            </p>
          </>
        )}
        {method === "register" && (
          <div className="mb-4">
            <label className="block text-synth-text mb-2">Choose a profile picture:</label>
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
                    focus:outline-none
                    dark:file:bg-synth-primary/10"
                />
              </div>
              {profilePicture && (
                <button
                  type="button"
                  onClick={clearProfilePicture}
                  className="button-retro py-2.5 px-4 text-sm h-[42px] flex items-center justify-center min-w-[100px] cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>
          </div>
        )}
        {loading && <LoadingIndicator />}
        <button
          className="button-retro w-full py-3 rounded text-xl cursor-pointer"
          type="submit"
        >
          {name}
        </button>
        <p className="text-center mt-4 text-synth-secondary neon-text text-lg">
          {method === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-synth-primary link-hover inline-block cursor-pointer font-semibold decoration-synth-primary decoration-2 underline-offset-4 px-1 py-0.5 rounded hover:bg-synth-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-synth-secondary transition duration-150"
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