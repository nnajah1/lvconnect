export function Loader() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-center items-center">
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
     <div className="text-center flex items-center justify-center h-full bg-white">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin bg-transparent"></div>
      </div>
  );
};

export function Loader4() {
  return (
     <div className="text-center flex items-center justify-center h-full bg-white">
        <div className="w-5 h-5 border-4 border-t-transparent border-gray-500 border-solid rounded-full animate-spin bg-transparent"></div>
      </div>
  );
};

export function Authenticate() {
   return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gray-100 bg-opacity-90">
      <div className="w-14 h-14 border-4 border-t-transparent border-blue-600 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 text-lg font-medium select-none">
        Authenticating...
      </p>
    </div>
  );
}

