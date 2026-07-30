import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold gradient-text mb-4">Forgot Password</h1>
      <p className="text-gray-400 mb-8">Coming Soon — P1 Feature</p>
      <Link to="/login" className="text-purple-400 hover:text-purple-300 underline">
        ← Back to Login
      </Link>
    </div>
  );
}
