import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password not matching");
      return;
    }
    setError("");
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      console.log("Registration Success", res.data);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError(
        err.response?.data?.error || "Something went wrong! Try again later"
      );
    }
  };

  return (
    <div className="bg-linear-[30deg,#f54ea2,#ff7676] min-h-screen p-5 rounded-3xl">
      <Navbar />
      <form
        className="flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="w-xl bg-white p-10 flex flex-col gap-10">
          <p className="text-4xl text-[#ff7676] self-center">Register</p>
          <div className="flex gap-2 flex-col ">
            <label className="pl-1">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              className="border border-gray-400 rounded-xl px-5 py-2.5"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex gap-2 flex-col">
            <label className="pl-1">Email Address</label>
            <input
              type="email"
              placeholder="@mail.com"
              value={email}
              required
              className="border border-gray-400 rounded-xl px-5 py-2.5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="pl-1">Password</label>
            <input
              type="password"
              value={password}
              minLength={6}
              placeholder="Password"
              required
              className="border border-gray-400 rounded-xl px-5 py-2.5"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="pl-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="**********"
              required
              className="border border-gray-400 rounded-xl px-5 py-2.5"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white rounded-4xl self-center px-5 py-2.5"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
