import { LoaderCircle } from "lucide-react";

function Loader({
  text = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "min-h-screen"
          : "min-h-[200px]"
      } bg-slate-50 dark:bg-slate-950`}
    >
      <div className="flex flex-col items-center justify-center">

        <LoaderCircle
          size={42}
          className="animate-spin text-indigo-600 dark:text-indigo-400"
        />

        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {text}
        </p>

      </div>
    </div>
  );
}

export default Loader;