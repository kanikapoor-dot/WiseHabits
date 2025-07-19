import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Successful", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setError(
        err.response?.data?.error || "Something went wrong! Try again later"
      );
    }
  };

  return (
    <div className="bg-linear-to-bl from-primary to-secondary min-h-screen p-5 ">
      <Navbar />
      <form
        className="flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className=" w-xl bg-white p-10 flex flex-col gap-10">
          <p className="text-4xl text-text1 self-center">Login</p>
          <div className="flex gap-2 flex-col">
            <label className="pl-1">Email Address</label>
            <input
              type="email"
              placeholder="@mail.com"
              value={email}
              required
              autoFocus
              className="border border-gray-400 rounded-xl px-5 py-2.5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="pl-1">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              required
              className="border border-gray-400 rounded-xl px-5 py-2.5"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white rounded-4xl self-center px-5 py-2.5"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
