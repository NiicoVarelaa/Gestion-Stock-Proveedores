import type { FieldError } from 'react-hook-form';

export function FormFieldError({ error }: { error?: FieldError }) {
  if (!error?.message) return null;
  return <p className="text-sm text-red-500">{error.message}</p>;
}
