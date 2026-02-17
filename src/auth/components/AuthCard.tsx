import type { ReactNode } from "react";
import RocketLogo from "../../shared/ui/RocketLogo";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE (FORM) */}
      <div className="flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md ">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <RocketLogo />
            <span className="font-bold text-2xl ">TeamTask</span>
          </div>

          <h1 className="text-2xl font-semibold items-center flex flex-col">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6 items-center flex flex-col">
            {subtitle}
          </p>

          {children}
        </div>
      </div>

      {/* RIGHT SIDE (IMAGE PANEL) */}
      <div className="hidden md:flex items-center justify-center bg-linear-to-br from-blue-200 to-blue-500">
        <img src="/auth-page-side-image.png" alt="rocket-image" className="w-auto h-72"/>
      </div>
    </div>
  );
}
