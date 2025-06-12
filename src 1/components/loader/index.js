const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-row gap-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-red-500" />
        <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 [animation-delay:-.3s]" />
        <div className="h-4 w-4 animate-bounce rounded-full bg-red-500 [animation-delay:-.5s]" />
      </div>
    </div>
  );
};

export default Loader;
