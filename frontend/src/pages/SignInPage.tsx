import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/scan"); // redirect to scan after login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/scan");
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-Lavender to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl  shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center text-black">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Sign in to continue to <span className="text-purple-600 font-semibold">Skin Chapters</span>
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 text-black placeholder-gray-300"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 text-black placeholder-gray-300"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-400 to-purple-600 text-white font-semibold py-5 rounded-lg hover:opacity-90 transition"
              >
                Sign In
              </Button>
            </form>

            <div className="flex items-center justify-center my-4">
              <div className="w-1/5 border-b border-gray-600"></div>
              <span className="px-2 text-gray-500 text-sm">or</span>
              <div className="w-1/5 border-b border-gray-600"></div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center bg-white text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FcGoogle size={22} /> Sign in with Google
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-700 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
