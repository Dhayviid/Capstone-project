import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginSuccess } from "../slices/auth.slice";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import AuthTabs from "../components/auth-tabs";
import { MdOutlineMail, MdOutlineLock, MdOutlinePerson } from "react-icons/md";
import { useState } from "react";

export default function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    dispatch(loginSuccess());
    toast.success("Account created successfully");
    navigate("/dashboard");
  };

  return (
    <AuthCard title="Create Account" subtitle="Start your 30 days free trial">
      <AuthTabs />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-gray-400">
            <MdOutlinePerson />
          </span>
          <input
            type="text"
            placeholder="Full name"
            className="w-full outline-none text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

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
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-4">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-600 font-medium">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
