import type {
  FieldValues,
  UseFormRegister,
  FieldError,
  Path,
} from "react-hook-form";

export default function InputField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  className = "",
}: {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-left">
        <label className="font-medium" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
        />
      </div>
      <div className="text-red-500">
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
}
