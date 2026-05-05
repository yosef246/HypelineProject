import { forwardRef } from "react";
import clsx from "clsx";

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}) {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && <div className="field-error">{error}</div>}
      {!error && hint && (
        <div className="mt-1 text-xs text-ink-500">{hint}</div>
      )}
    </div>
  );
}

export const Input = forwardRef(function Input(props, ref) {
  return (
    <input ref={ref} {...props} className={clsx("input", props.className)} />
  );
});

export const Textarea = forwardRef(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={clsx("input min-h-[100px]", props.className)}
    />
  );
});

export const Select = forwardRef(function Select({ children, ...props }, ref) {
  return (
    <select
      ref={ref}
      {...props}
      className={clsx("input pr-10", props.className)}
    >
      {children}
    </select>
  );
});
