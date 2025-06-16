import { useLoading } from "@/context/LoadingContext";
import { Loader2 } from "lucide-react";

export default function GlobalPreloader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-40 max-h-screen flex items-center justify-center bg-white/80 dark:bg-slate-950/80">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}
