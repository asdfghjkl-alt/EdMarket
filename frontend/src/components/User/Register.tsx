import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import type { LoginFormData, RegisterFormData } from "../../types/user";
import { useState } from "react";

const registerSchema = Joi.object({
  email: Joi.string().email(),
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
  } = useForm<RegisterFormData>({
    resolver: joiResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { username: "", password: "", email: "" },
  });
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(data: RegisterFormData) {
    try {
      await fetch("http://localhost:3314/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
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
        <label htmlFor="email">Email: </label>
        <input placeholder="Email" {...register("email")} />
      </div>
      <div className="error-box">
        {errors.email && <span>{errors.email.message}</span>}
      </div>
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
