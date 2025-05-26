import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  description: string;
  placeholder?: string;
  name?: string;
  error?: string;
  required?: boolean;
  textarea?: boolean;
  select?: boolean;
  type?: string;
  options?: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function FormField({
  label,
  description,
  placeholder,
  error,
  required = false,
  textarea = false,
  select = false,
  type = "text",
  options = [],
  disabled = false,
  onChange,
  ...props
}: FormFieldProps) {
  return (
    <div className="@container mt-6 max-w-full w-[705px]">
      <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
        <div className="grow shrink-0 basis-0 w-full">
          <label className="text-base text-neutral-900">{label}</label>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="grow shrink-0 text-base text-gray-400 basis-0 w-fit @[320px]:w-full">
          {textarea ? (
            <textarea
              placeholder={placeholder}
              className="overflow-hidden gap-1.5 self-stretch px-4 py-3 w-full rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[100px] text-black placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              required={required}
              disabled={disabled}
              onChange={onChange}
              {...props}
            />
          ) : select ? (
            <select
              className="overflow-hidden gap-1.5 self-stretch px-4 py-3 w-full rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px] text-black disabled:opacity-50 disabled:cursor-not-allowed"
              required={required}
              disabled={disabled}
              onChange={onChange}
              {...props}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              placeholder={placeholder}
              className="overflow-hidden gap-1.5 self-stretch px-4 py-3 w-full rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px] text-black placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              required={required}
              disabled={disabled}
              onChange={onChange}
              {...props}
            />
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
