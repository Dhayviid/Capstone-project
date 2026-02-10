import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthCard from "../components/AuthCard";
import { loginSuccess } from "../slices/auth.slice";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginSuccess());
    toast.success("Account created successfully");

    navigate("/dashboard");
  };

  return (
    <AuthCard
      title="Sign Up"
      subtitle="Let's get started with your 30 days free trial"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-md text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-md text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-md text-sm"
        />

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded-md text-sm"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-4">
        Already have an account?{" "}
        <Link to="/signin" className="text-slate-800 font-medium">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
