import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate, Link } from "react-router";
import Joi from "joi";
import type { RegisterFormData } from "@/types/user";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/UserContext";
import InputField from "@/components/ui/inputs/InputField";
import { AxiosError } from "axios";

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
  const { register: authRegister } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render a spinner instead of the login form
  }

  async function onSubmit(data: RegisterFormData) {
    setIsRegistering(true);
    setErrMsg("");
    try {
      await authRegister(data.email, data.username, data.password);
      navigate(-1);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.status === 401) {
          setErrMsg("Either username or password is incorrect");
        } else {
          setErrMsg(e.response?.data.message || e.response?.data);
        }
      } else {
        setErrMsg("Unexpected error occurred");
      }
      setIsRegistering(false);
      reset();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <p className="my-8 text-5xl font-bold">EdMarket</p>
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h1>Register an account for EdMarket</h1>
        <p>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 decoration-blue-500 decoration-solid hover:text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className="text-red-500">{errMsg}</p>
          <InputField
            name="email"
            placeholder="Email"
            label="Email"
            register={register}
            error={errors.email}
          />
          <InputField
            name="username"
            placeholder="Username"
            label="Username"
            register={register}
            error={errors.username}
          />
          <hr className="m-1 text-red-100" />
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
            disabled={isRegistering}
            className="btn btn-submit w-full"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
