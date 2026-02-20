import { useDispatch } from "react-redux";
import AuthCard from "../components/AuthCard";
import { useNavigate } from "react-router";
import { loginSuccess } from "../slices/auth.slice";
import toast from "react-hot-toast";
import {
  MdOutlineFacebook,
  MdOutlineMail,
  MdOutlineLock,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";
import AuthTabs from "../components/auth-tabs";
import { useState } from "react";

export default function SignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if both fields are filled
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    dispatch(loginSuccess());
    toast.success("Signed in successfully");
    navigate("/dashboard");
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Welcome back. Please enter your details"
    >
      {/* Tabs */}
      <AuthTabs />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-gray-400">
            <MdOutlineMail />
          </span>
          <input
            type="email"
            placeholder="Email address"
            className="w-full outline-none text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-gray-400">
            <MdOutlineLock />
          </span>
          <input
            type="password"
            placeholder="Password"
            className="w-full outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social Buttons */}
      <div className="flex justify-center gap-4">
        <button className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer">
          <FcGoogle />
        </button>
        <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
          <AiFillApple />
        </button>
        <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer">
          <MdOutlineFacebook />
        </button>
      </div>
    </AuthCard>
  );
}
