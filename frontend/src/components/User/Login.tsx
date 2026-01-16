import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import type { LoginFormData } from "../../types/user";
import { useState } from "react";
import "./User.css";

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({ "string.empty": "Username cannot be blank." }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be blank",
  }),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { username: "", password: "" },
  });
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await fetch("http://localhost:3314/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error: Incorrect username or password");
      }

      navigate("/");
    } catch (e) {
      if (e instanceof Error) {
        setErrMsg(e.message);
      } else {
        setErrMsg("Unexpected error occurred");
      }
      reset();
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h1 className="text-xl">Login to EdMarket</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errMsg}
          <div>
            <input
              placeholder="Username"
              className="size-full p-1 text-lg"
              {...register("username")}
            />
          </div>
          <div className="text-red-500">
            {errors.username && <span>{errors.username.message}</span>}
          </div>
          <div>
            <input
              type="password"
              className="size-full p-1 text-lg"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <div className="text-red-500">
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <button type="submit" className="btn-auth">
            Login
          </button>
          <p className="mt-2">
            Do not have an EdMarket Account?{" "}
            <a
              href="/auth/register"
              className="text-blue-600 decoration-blue-500 decoration-solid hover:text-blue-400 hover:underline"
            >
              Create an EdMarket Account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
