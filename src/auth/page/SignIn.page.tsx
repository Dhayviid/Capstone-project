import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthCard from "../components/AuthCard";
import { loginSuccess } from "../slices/auth.slice";
import toast from "react-hot-toast";

export default function SignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Mark user as authenticated
    dispatch(loginSuccess());
    toast.success("Signed in successfully");

    // 2️⃣ Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <AuthCard title="Log In" subtitle="Welcome back! Please enter your details">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          Log In
        </button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-slate-800 font-medium">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
