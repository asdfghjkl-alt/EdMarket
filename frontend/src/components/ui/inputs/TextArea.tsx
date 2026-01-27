import type {
  FieldValues,
  UseFormRegister,
  FieldError,
  Path,
} from "react-hook-form";

export default function TextArea<T extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  error,
  rows,
  className = "",
}: {
  label: string;
  name: Path<T>;
  placeholder: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  rows: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-left">
        <label className="font-medium" htmlFor={name}>
          {label}
        </label>
        <textarea
          placeholder={placeholder}
          rows={rows}
          id={name}
          {...register(name)}
        ></textarea>
      </div>
      <div className="mb-1 text-red-500">
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
}
