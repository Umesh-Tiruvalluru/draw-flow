"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { login } from "@/service";
import Redirect from "./Redirect";

interface AuthPageProps {
  isLogin: boolean;
}

interface FormData {
  email: string;
  password: string;
  fullName?: string;
}

export default function AuthPage({ isLogin }: AuthPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      if (!isValidEmail(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (isLogin) {
        const response = await login(formData.email, formData.password);
        if (response) {
          router.push("/dashboard");
        }
      } else {
        if (!formData.fullName) {
          throw new Error("Please enter your full name");
        }
        // Add signup logic here
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center justify-center flex-col w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 flex flex-col justify-center items-center rounded-xl w-full shadow-lg"
        >
          <h1 className="text-2xl font-semibold mb-8">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          {error && (
            <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center w-full gap-4 flex-col mb-6">
            {!isLogin && (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border border-zinc-300 rounded-lg py-3 px-4 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            )}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-zinc-300 rounded-lg py-3 px-4 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email address"
              disabled={isLoading}
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-zinc-300 rounded-lg py-3 px-4 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full py-3"
            label={isLoading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            // disabled={isLoading}
          />
        </form>

        <div className="mt-6 text-zinc-500">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                className="text-blue-600 hover:text-blue-800 underline"
                href="/signup"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                className="text-blue-600 hover:text-blue-800 underline"
                href="/login"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
