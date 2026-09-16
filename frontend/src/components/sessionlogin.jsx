import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { useState } from "react";
import sessionApi from "../sessionApi";

const SessionLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function onSubmit(data) {
    setLoading(true);
    setServerError("");
    try {
      // Step 1: get CSRF cookie set before attempting login
      await sessionApi.get("/sanctum/csrf-cookie");

      // Step 2: log in — sets the session cookie, no token returned
      const response = await sessionApi.post("/api/session/login", data);

      alert(response.data.message);
      navigate("/session-dashboard");
    } catch (error) {
      console.log("Error posting data", error);
      setServerError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-200 flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
        className="bg-white p-8 rounded-lg gap-4 flex flex-col mt-20 w-120 mb-20"
      >
        <label htmlFor="email" className="font-semibold">
          {" "}
          Email
        </label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Enter you email"
          className="border border-gray-200 rounded-md p-2
                focus:outline-none focus:ring-1"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-sm text-red-500"> {errors.email.message}</span>
        )}

        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {" "}
            {errors.password.message}
          </span>
        )}

        {serverError && (
          <span className="text-sm text-red-500">{serverError}</span>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-300 p-2 w-45  rounded-md focus:ring-blue-500 hover:bg-blue-600 self-center"
        >
          {loading ? "Logging in..." : "Login (Session)"}
        </button>
        <p className="flex justify-center gap-2">
          Don't have an account yet?
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SessionLogin;
