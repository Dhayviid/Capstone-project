import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginSuccess } from "../slices/auth.slice";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import AuthTabs from "../components/auth-tabs";

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
    <AuthCard title="Create Account" subtitle="Start your 30 days free trial">
      <AuthTabs/>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full name"
          className="w-full border px-4 py-2 rounded-lg text-sm"
        />
        <input
          placeholder="Email address"
          className="w-full border px-4 py-2 rounded-lg text-sm"
        />
        <input
          placeholder="Password"
          type="password"
          className="w-full border px-4 py-2 rounded-lg text-sm"
        />

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
