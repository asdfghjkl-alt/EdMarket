import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import type { LoginFormData } from "../../types/user";
import { useState } from "react";

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
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {errMsg}
      <div>
        <label htmlFor="username">Username: </label>
        <input placeholder="Username" {...register("username")} />
      </div>
      <div className="error-box">
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
      </div>
      <div className="error-box">
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
