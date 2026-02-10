import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="h-1 w-full bg-red-500 rounded-full mb-6" />

        <h1 className="text-2xl font-semibold text-center">{title}</h1>
        <p className="text-sm text-slate-500 text-center mt-1 mb-6">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}
