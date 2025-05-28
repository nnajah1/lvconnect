export function Loader() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin bg-transparent"></div>
    </div>
  );
};

export function Loader2() {
  return (
    <div className="fixed inset-0 z-10 flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin bg-transparent"></div>
    </div>
  );
};


export function Loader3() {
  return (
     <div className="text-center flex items-center justify-center h-full bg-muted">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin bg-transparent"></div>
      </div>
  );
};