// src/components/Form.tsx

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function Form() {
  const [method, setMethod] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const route = method === "login" ? "/api/token/" : "/api/user/register/";

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMethod = () => {
    setMethod(method === 'login' ? 'register' : 'login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-synth-background">
      <form onSubmit={handleSubmit} className="bg-synth-background p-8 rounded-lg neon-border max-w-md w-full">
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
            className="text-synth-primary cursor-pointer hover:underline"
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