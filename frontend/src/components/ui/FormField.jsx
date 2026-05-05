import clsx from 'clsx';

export function FormField({ label, error, hint, required, children, className }) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && <div className="field-error">{error}</div>}
      {!error && hint && <div className="mt-1 text-xs text-ink-500">{hint}</div>}
    </div>
  );
}

export const Input = (props) => <input {...props} className={clsx('input', props.className)} />;
export const Textarea = (props) => <textarea {...props} className={clsx('input min-h-[100px]', props.className)} />;
export const Select = ({ children, ...props }) => (
  <select {...props} className={clsx('input pr-10', props.className)}>{children}</select>
);
