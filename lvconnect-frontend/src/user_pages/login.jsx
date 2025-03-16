import { useState } from "react";
import logo from "../src/assets/lv-logo.png";
import illustration from "../src/assets/illustration.jpg";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa6";
import { IoLockClosed } from "react-icons/io5";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "",
        headers: { "": "" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Incorrect credentials. Please try again.");
        return;
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <img src={illustration} alt="Background" className="absolute w-full h-full object-cover" />
      <div className="absolute left-0 top-0 h-full w-[540px] flex flex-col justify-center px-12 bg-white/75 backdrop-blur-md shadow-lg">
        <div className="flex flex-row items-center justify-center mb-6">
          <img src={logo} alt="LVConnect Logo" className="w-14 h-14 mr-2" />
          <h1 className="text-[20px] font-bold leading-[40px] text-[#1F3463]">
            <span className="text-[#36A9E1]">LV</span>
            <span className="text-[16px] leading-[24px] font-extrabold">Connect</span>
          </h1>
        </div>

        <h2 className="text-[20px] text-gray-500 font-semibold text-center mb-4">
          Sign in to your account to continue.
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mt-3 block text-m font-bold text-gray-600">Email address</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-black bg-white rounded-md text-sm font-medium focus:outline-none"
                placeholder="Enter your email address"
              />
            </div>
          </div>
          <div>
            <label className="block text-m font-bold text-gray-600">Password</label>
            <div className="relative">
              <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-black bg-white rounded-md text-sm font-medium focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-red-500 text-sm">{error}</p>
              <a href="#" className="text-gray-600 text-sm hover:underline">Forgot your password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2.5 w-full h-12 bg-[#2CA4DD] text-white rounded-md text-l font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-black" />
          <span className="mx-2 text-black text-xs font-bold">OR</span>
          <hr className="flex-1 border-black" />
        </div>

        <button className="w-full h-12 border text-gray-500 border-gray-400 bg-white rounded-md flex items-center justify-center text-sm font-medium">
          <FcGoogle className="w-5 h-5 mr-2" /> Sign in with Google
        </button>

        <p className="text-center text-m text-black mt-8">
          <a href="#" className="underline">Terms of Use</a> and {" "}
          <a href="#" className="underline">Privacy Statement</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
