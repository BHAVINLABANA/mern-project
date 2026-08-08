function Loader({
  text = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "min-h-screen bg-slate-50 dark:bg-slate-950"
          : "py-10"
      }`}
    >
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />

        {/* Text */}

        {text && (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {text}
          </p>
        )}

      </div>
    </div>
  );
}

export default Loader;