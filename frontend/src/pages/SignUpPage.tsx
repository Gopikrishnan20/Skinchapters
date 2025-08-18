import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../lib/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/scan"); // redirect to scan page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/scan");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-Lavender to-gray-800 px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl  shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-black">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Input
              type="email"
              placeholder="Email"
              className="bg-white/20 text-black placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              className="bg-white/20 text-black placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
            >
              Sign Up
            </Button>
          </form>

          <div className="flex items-center justify-center my-4">
            <span className="w-1/5 border-b border-gray-600"></span>
            <span className="px-2 text-gray-600 text-sm">or</span>
            <span className="w-1/5 border-b border-gray-600"></span>
          </div>

          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full flex items-center justify-center bg-white text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="mr-2 text-xl" /> Sign Up with Google
          </Button>

          <p className="text-center text-gray-700 text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-purple-700 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
