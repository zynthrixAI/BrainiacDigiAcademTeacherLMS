interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-[10px] border border-[#f5b5b5] bg-[#fef2f2] p-3 text-xs font-semibold text-red"
    >
      {message}
    </div>
  );
}
