function ErrorMessage({ msg }: { msg: string }) {
  return (
    <div className="text-xs text-red-500 mt-1">
      <div className="w-1/3 inline-block" />
      <span>{msg}</span>
    </div>
  );
}

export default ErrorMessage;
