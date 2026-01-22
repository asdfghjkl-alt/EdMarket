import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate, Link } from "react-router";
import Joi from "joi";
import type { LoginFormData } from "@/types/user";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/UserContext";
import { AxiosError } from "axios";
import InputField from "@/components/ui/inputs/InputField";

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
  const { login: authLogin, loading, user } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user && !isLoggingIn) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render a spinner instead of the login form
  }

  async function onSubmit(data: LoginFormData) {
    setIsLoggingIn(true);
    setErrMsg("");
    try {
      await authLogin(data.username, data.password);
      navigate(-1);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.status === 401) {
          setErrMsg("Either username or password is incorrect");
        } else {
          setErrMsg(e.message);
        }
      } else {
        setErrMsg("Unexpected error occurred");
      }
      setIsLoggingIn(false);
      reset();
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="my-8 text-5xl font-bold">EdMarket</p>
      <div className="w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h1>Login to EdMarket</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errMsg}
          <InputField
            name="username"
            placeholder="Username"
            label="Username"
            register={register}
            error={errors.username}
          />
          <InputField
            name="password"
            placeholder="Password"
            type="password"
            label="Password"
            register={register}
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn-submit cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Login
          </button>
          <p className="mt-2">
            Do not have an EdMarket Account?{" "}
            <Link
              to="/auth/register"
              className="text-blue-600 decoration-blue-500 decoration-solid hover:text-blue-400 hover:underline"
            >
              Create an EdMarket Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
