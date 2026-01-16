import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import type { RegisterFormData } from "../../types/user";
import { useState } from "react";
import "./User.css";

const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({ "string.empty": "Username cannot be blank." }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be blank",
  }),
  email: Joi.string().required().email().messages({
    "string.empty": "Email cannot be blank",
    "string.email": "Please enter in a valid email address",
  }),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: joiResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { username: "", password: "", email: "" },
  });
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(data: RegisterFormData) {
    try {
      const response = await fetch("http://localhost:3314/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error: Failed to create the new user");
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
        <h1 className="text-xl">Register an account for EdMarket</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errMsg}
          <div>
            <input
              placeholder="Email"
              className="size-full p-1 text-lg"
              {...register("email")}
            />
          </div>
          <div className="text-red-500">
            {errors.email && <span>{errors.email.message}</span>}
          </div>
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
          <hr className="m-1 text-red-100" />
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
